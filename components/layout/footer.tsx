import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-[#eaeaea] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hauptbereich mit Logo und Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand-Bereich */}
          <div className="md:col-span-2">
            <h3 className="font-bold text-xl text-gray-900 mb-3">
              <span className="text-primary-500">Azu</span>
              <span className="text-accent-500">Bite</span>
            </h3>
            <p className="text-sm text-gray-600 mb-4 max-w-xs">
              Die kollaborative Plattform für Auszubildende. Teile Wissen, lerne gemeinsam und baue dein Netzwerk auf.
            </p>
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center hover:bg-primary-200 transition-colors cursor-pointer">
                <span className="text-primary-600 text-lg">📘</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center hover:bg-primary-200 transition-colors cursor-pointer">
                <span className="text-primary-600 text-lg">🐦</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center hover:bg-primary-200 transition-colors cursor-pointer">
                <span className="text-primary-600 text-lg">📷</span>
              </div>
            </div>
          </div>

          {/* Plattform Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">
              Plattform
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400"></span>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/reports" className="text-gray-600 hover:text-primary-600 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400"></span>
                  Berichte
                </Link>
              </li>
              <li>
                <Link href="/groups" className="text-gray-600 hover:text-primary-600 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400"></span>
                  Gruppen
                </Link>
              </li>
            </ul>
          </div>

          {/* Rechtliches */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">
              Rechtliches
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/impressum" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/agb" className="text-gray-600 hover:text-primary-600 transition-colors">
                  AGB
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">
              Support
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/hilfe" className="text-gray-600 hover:text-accent-500 transition-colors">
                  Hilfe & FAQ
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-gray-600 hover:text-accent-500 transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Unterer Bereich mit Copyright */}
        <div className="pt-12 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} AzuBite. Alle Rechte vorbehalten.
            </p>
            <div className="flex gap-6 text-sm text-gray-600">
              <Link href="/datenschutz" className="hover:text-primary-600 transition-colors">
                Datenschutz
              </Link>
              <Link href="/agb" className="hover:text-primary-600 transition-colors">
                AGB
              </Link>
              <Link href="/impressum" className="hover:text-primary-600 transition-colors">
                Impressum
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

