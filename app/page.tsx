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

      {/* Hero Section - weiter unten positioniert */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-20 pb-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Willkommen bei AzuBite
          </h1>
          <p className="text-base text-gray-600 mb-3 max-w-2xl mx-auto">
            Die kollaborative Plattform für Auszubildende. Teile deine
            Berichtshefte, lerne von anderen und baue dein Netzwerk auf.
          </p>
          {/* Sub-Text - glaubwürdig */}
          <p className="text-sm text-gray-500 mb-4 max-w-xl mx-auto">
            Bereits viele Auszubildende nutzen AzuBite täglich • Kostenlos • Keine Kreditkarte erforderlich
          </p>
          
          {/* Mini-Illustration */}
          <div className="mb-6 flex justify-center opacity-10">
            <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="8" fill="currentColor" className="text-primary-500"/>
              <circle cx="60" cy="20" r="8" fill="currentColor" className="text-accent-500"/>
              <circle cx="100" cy="20" r="8" fill="currentColor" className="text-primary-500"/>
              <path d="M28 20 L52 20" stroke="currentColor" strokeWidth="2" className="text-primary-400"/>
              <path d="M68 20 L92 20" stroke="currentColor" strokeWidth="2" className="text-accent-400"/>
            </svg>
          </div>

          {!session && (
            <div className="flex gap-4 justify-center items-center">
              <Link href="/register" className="w-48">
                <Button size="lg" className="w-full bg-accent-500 hover:bg-accent-600 text-white shadow-md hover:shadow-lg transition-all">
                  Jetzt starten
                </Button>
              </Link>
              <Link href="/login" className="w-48">
                <Button size="lg" variant="outline" className="w-full border-2 border-primary-500 text-primary-600 hover:bg-primary-50 hover:border-primary-600 transition-all">
                  Anmelden
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Features mit stärkerem Schatten und besseren Icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:scale-[1.01] transition-all duration-300 cursor-pointer group">
            <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="6" width="32" height="36" rx="2" fill="#3b82f6" className="group-hover:fill-primary-600 transition-colors"/>
                <path d="M14 14h20M14 20h20M14 26h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M32 32l4 4 8-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
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
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:scale-[1.01] transition-all duration-300 cursor-pointer group">
            <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="16" r="6" fill="#f97316" className="group-hover:fill-accent-600 transition-colors"/>
                <path d="M12 36c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#f97316" strokeWidth="3" strokeLinecap="round" className="group-hover:stroke-accent-600 transition-colors"/>
                <circle cx="36" cy="20" r="4" fill="#f97316" className="group-hover:fill-accent-600 transition-colors"/>
                <path d="M28 32c0-2.209 1.791-4 4-4s4 1.791 4 4" stroke="#f97316" strokeWidth="2" strokeLinecap="round" className="group-hover:stroke-accent-600 transition-colors"/>
              </svg>
            </div>
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
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:scale-[1.01] transition-all duration-300 cursor-pointer group">
            <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 8c-8.837 0-16 7.163-16 16 0 5.5 2.8 10.3 7 13.2l9 10.8 9-10.8c4.2-2.9 7-7.7 7-13.2 0-8.837-7.163-16-16-16z" fill="#3b82f6" className="group-hover:fill-primary-600 transition-colors"/>
                <circle cx="20" cy="20" r="2" fill="white"/>
                <circle cx="24" cy="20" r="2" fill="white"/>
                <circle cx="28" cy="20" r="2" fill="white"/>
                <path d="M18 26h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
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

