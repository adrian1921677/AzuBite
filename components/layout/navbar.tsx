"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo - deutlich größer */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0">
            <Image
              src="/logo.png"
              alt="AzuBite Logo"
              width={300}
              height={120}
              className="h-20 w-auto"
              priority
            />
          </Link>

          {/* Navigation Links - zentriert */}
          <div className="hidden md:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/reports"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Berichte
            </Link>
            <Link
              href="/groups"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Gruppen
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4 ml-auto">
            {mounted && session ? (
              <>
                <Link href="/profile">
                  <Button variant="ghost" className="hidden sm:inline-flex">
                    Profil
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Abmelden
                </Button>
              </>
            ) : (
              <Link href="/register">
                <Button size="sm" className="bg-accent-500 hover:bg-accent-600 text-white shadow-md hover:shadow-lg transition-all">
                  Registrieren
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

