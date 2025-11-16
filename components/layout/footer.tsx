import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">AzuBite</h3>
            <p className="text-sm text-gray-600">
              Die kollaborative Plattform für Auszubildende.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Plattform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-primary-600">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/reports" className="text-gray-600 hover:text-primary-600">
                  Berichte
                </Link>
              </li>
              <li>
                <Link href="/groups" className="text-gray-600 hover:text-primary-600">
                  Gruppen
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Rechtliches</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/impressum" className="text-gray-600 hover:text-primary-600">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-gray-600 hover:text-primary-600">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/agb" className="text-gray-600 hover:text-primary-600">
                  AGB
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/hilfe" className="text-gray-600 hover:text-primary-600">
                  Hilfe & FAQ
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-gray-600 hover:text-primary-600">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} AzuBite. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
}

