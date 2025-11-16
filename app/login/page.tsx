"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Erfolgreich angemeldet!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      toast.error("Ein Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    setIsLoading(true);
    await signIn(provider, { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4 relative overflow-hidden">
      {/* Subtile Hintergrund-Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Großer Kreis oben rechts - Blau */}
        <div 
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary-400 opacity-[0.08] blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)' }}
        />
        {/* Kleinerer Kreis unten links - Orange */}
        <div 
          className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-accent-400 opacity-[0.08] blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, transparent 70%)' }}
        />
        {/* Mittlerer Kreis rechts Mitte - Blau */}
        <div 
          className="absolute top-1/2 -right-16 w-48 h-48 rounded-full bg-primary-300 opacity-[0.06] blur-2xl"
        />
      </div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-[#e8e8e8] p-8 relative z-10">
        <div className="text-center mb-6">
          <Link href="/" className="inline-block">
            <Image
                src="/logo.png"
              alt="AzuBite Logo"
              width={280}
              height={112}
              className="h-24 w-auto mx-auto"
              priority
            />
          </Link>
          <h1 className="text-2xl font-bold mt-3">Anmelden</h1>
          <p className="text-gray-600 mt-3">
            Melde dich an, um fortzufahren
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
              Email oder Benutzername
            </label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              placeholder="test@test.com oder test"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Passwort
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent-500 hover:bg-accent-600 text-white shadow-md hover:shadow-lg transition-all h-12 text-base font-semibold"
          >
            {isLoading ? (
              <span className="flex items-center gap-2 justify-center">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Lädt...
              </span>
            ) : (
              "Jetzt anmelden"
            )}
          </Button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-400" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-gray-500 text-xs font-medium">oder</span>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full border-[#d0d0d0] hover:bg-gray-50 h-11"
              onClick={() => handleSocialLogin("google")}
              disabled={isLoading}
            >
              <div className="flex items-center justify-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Mit Google anmelden</span>
              </div>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full border-[#d0d0d0] hover:bg-gray-50 h-11"
              onClick={() => handleSocialLogin("github")}
              disabled={isLoading}
            >
              <div className="flex items-center justify-center gap-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                </svg>
                <span>Mit GitHub anmelden</span>
              </div>
            </Button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Noch kein Konto?{" "}
          <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
            Registrieren
          </Link>
        </p>
      </div>
    </div>
  );
}

