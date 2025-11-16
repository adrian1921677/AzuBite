"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Ein Fehler ist aufgetreten
        </h1>
        <p className="text-gray-600 mb-6">
          Entschuldigung, es ist ein unerwarteter Fehler aufgetreten.
        </p>
        {process.env.NODE_ENV === "development" && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg text-left">
            <p className="text-sm text-red-800 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-600 mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>Erneut versuchen</Button>
          <Link href="/">
            <Button variant="outline">Zur Startseite</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

