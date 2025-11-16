import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export async function Navbar() {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("Fehler beim Laden der Session:", error);
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo - deutlich größer */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Image
              src="/logo.png"
              alt="AzuBite Logo"
              width={200}
              height={80}
              className="h-16 w-auto"
              priority
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
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
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link href="/profile">
                  <Button variant="ghost" className="hidden sm:inline-flex">
                    Profil
                  </Button>
                </Link>
                <Link href="/api/auth/signout">
                  <Button variant="outline" size="sm">
                    Abmelden
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="hidden sm:inline-flex">
                    Anmelden
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Registrieren</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

