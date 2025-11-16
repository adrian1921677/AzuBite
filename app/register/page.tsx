"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwörter stimmen nicht überein");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Passwort muss mindestens 8 Zeichen lang sein");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registrierung fehlgeschlagen");
      }

      toast.success("Registrierung erfolgreich! Bitte melde dich an.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Ein Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4 relative overflow-hidden">
      {/* Subtile Hintergrund-Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Großer Kreis oben rechts - Blau */}
        <div 
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary-400 opacity-[0.08] blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)' }}
        />
        {/* Kleinerer Kreis unten links - Orange */}
        <div 
          className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-accent-400 opacity-[0.08] blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, transparent 70%)' }}
        />
        {/* Mittlerer Kreis rechts Mitte - Blau */}
        <div 
          className="absolute top-1/2 -right-16 w-48 h-48 rounded-full bg-primary-300 opacity-[0.06] blur-2xl"
        />
      </div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-[#e8e8e8] p-8 relative z-10">
        <div className="text-center mb-6">
          <Link href="/" className="inline-block">
            <Image
                src="/logo.png"
              alt="AzuBite Logo"
              width={280}
              height={112}
              className="h-24 w-auto mx-auto"
              priority
            />
          </Link>
          <h1 className="text-2xl font-bold mt-3">Registrieren</h1>
          <p className="text-gray-600 mt-3">
            Erstelle ein neues Konto
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Passwort
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={8}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Passwort bestätigen
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-accent-500 hover:bg-accent-600 text-white shadow-md hover:shadow-lg transition-all h-12 text-base font-semibold"
            disabled={isLoading}
          >
            {isLoading ? "Lädt..." : "Registrieren"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Bereits ein Konto?{" "}
          <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Anmelden
          </Link>
        </p>
      </div>
    </div>
  );
}

