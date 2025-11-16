import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AzuBite - Kollaborative Plattform für Auszubildende",
  description: "Teile und entdecke Berichtshefte mit anderen Auszubildenden",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              success: {
                iconTheme: {
                  primary: '#3b82f6',
                  secondary: '#fff',
                },
                duration: 4000,
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}


