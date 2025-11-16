"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Kritischer Fehler
            </h1>
            <p className="text-gray-600 mb-6">
              Die Anwendung konnte nicht geladen werden. Bitte versuche es später erneut.
            </p>
            <button
              onClick={reset}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Erneut versuchen
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

