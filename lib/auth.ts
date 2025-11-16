import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Prüfe ob NEXTAUTH_SECRET gesetzt ist
if (!process.env.NEXTAUTH_SECRET) {
  console.warn("WARNING: NEXTAUTH_SECRET ist nicht gesetzt!");
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email oder Benutzername", type: "text" },
        password: { label: "Passwort", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Email/Benutzername und Passwort sind erforderlich");
        }

        // Prüfe ob es eine Email-Adresse ist (enthält @)
        const isEmail = credentials.identifier.includes("@");
        
        let user;
        if (isEmail) {
          // Suche nach Email
          user = await prisma.user.findUnique({
            where: { email: credentials.identifier },
          });
        } else {
          // Suche nach Name (Benutzername)
          user = await prisma.user.findFirst({
            where: { name: credentials.identifier },
          });
        }

        if (!user || !user.password) {
          throw new Error("Ungültige Anmeldedaten");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Ungültige Anmeldedaten");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};


