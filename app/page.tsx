import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="AzuBite Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <div className="flex items-center gap-4">
              {session ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="outline">Dashboard</Button>
                  </Link>
                  <Link href="/api/auth/signout">
                    <Button>Abmelden</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline">Anmelden</Button>
                  </Link>
                  <Link href="/register">
                    <Button>Registrieren</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Willkommen bei AzuBite
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Die kollaborative Plattform für Auszubildende. Teile deine
            Berichtshefte, lerne von anderen und baue dein Netzwerk auf.
          </p>
          {!session && (
            <div className="flex gap-4 justify-center">
              <Link href="/register">
                <Button size="lg">Jetzt starten</Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Anmelden
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">📄 Berichtshefte</h3>
            <p className="text-gray-600">
              Lade deine Berichtshefte hoch und teile sie mit anderen
              Auszubildenden.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">👥 Gruppen</h3>
            <p className="text-gray-600">
              Erstelle oder trete Gruppen bei und arbeite kollaborativ.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">💬 Austausch</h3>
            <p className="text-gray-600">
              Kommentiere und bewerte Berichte, um Feedback zu erhalten.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

