import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default async function Home() {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("Fehler beim Laden der Session:", error);
    // Session-Fehler nicht blockieren - Seite kann trotzdem angezeigt werden
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
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

        {/* Features - ähnlich gutefrage.net Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Berichtshefte</h3>
            <p className="text-gray-600">
              Lade deine Berichtshefte hoch und teile sie mit anderen
              Auszubildenden.
            </p>
          </div>
          <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Gruppen</h3>
            <p className="text-gray-600">
              Erstelle oder trete Gruppen bei und arbeite kollaborativ.
            </p>
          </div>
          <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Austausch</h3>
            <p className="text-gray-600">
              Kommentiere und bewerte Berichte, um Feedback zu erhalten.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

