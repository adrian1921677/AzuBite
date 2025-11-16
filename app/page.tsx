import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/ui/login-button";
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

      {/* Hero Section - 25-30% kleiner */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Willkommen bei AzuBite
          </h1>
          <p className="text-lg text-gray-600 mb-3 max-w-2xl mx-auto">
            Die kollaborative Plattform für Auszubildende. Teile deine
            Berichtshefte, lerne von anderen und baue dein Netzwerk auf.
          </p>
          {/* Sub-Text für mehr Persönlichkeit */}
          <p className="text-sm text-gray-500 mb-6 max-w-xl mx-auto">
            Über 1.000 Auszubildende vertrauen bereits auf AzuBite • Kostenlos • Keine Kreditkarte erforderlich
          </p>
          {!session && (
            <div className="flex gap-4 justify-center items-center">
              <Link href="/register">
                <Button size="lg" className="bg-accent-500 hover:bg-accent-600 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  Jetzt starten
                </Button>
              </Link>
              <LoginButton href="/login" variant="page">
                Anmelden
              </LoginButton>
            </div>
          )}
        </div>

        {/* Features mit Hover-Animationen und Farbsystem */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-8 rounded-xl border-2 border-gray-200 hover:border-primary-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📄</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-primary-600 transition-colors">
              Berichtshefte
            </h3>
            <p className="text-gray-600">
              Lade deine Berichtshefte hoch und teile sie mit anderen
              Auszubildenden.
            </p>
            <div className="mt-4 text-sm text-primary-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Mehr erfahren →
            </div>
          </div>
          <div className="bg-white p-8 rounded-xl border-2 border-gray-200 hover:border-accent-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">👥</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-accent-500 transition-colors">
              Gruppen
            </h3>
            <p className="text-gray-600">
              Erstelle oder trete Gruppen bei und arbeite kollaborativ.
            </p>
            <div className="mt-4 text-sm text-accent-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Mehr erfahren →
            </div>
          </div>
          <div className="bg-white p-8 rounded-xl border-2 border-gray-200 hover:border-primary-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">💬</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-primary-600 transition-colors">
              Austausch
            </h3>
            <p className="text-gray-600">
              Kommentiere und bewerte Berichte, um Feedback zu erhalten.
            </p>
            <div className="mt-4 text-sm text-primary-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Mehr erfahren →
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

