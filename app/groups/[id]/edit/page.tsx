"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function EditGroupPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    avatar: "",
    isPublic: true,
  });

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }
    loadGroup();
  }, [session]);

  const loadGroup = async () => {
    try {
      const res = await fetch(`/api/groups/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        // Prüfe ob Benutzer Besitzer ist
        if (data.ownerId !== session?.user?.id) {
          toast.error("Keine Berechtigung");
          router.push(`/groups/${params.id}`);
          return;
        }
        setFormData({
          name: data.name || "",
          description: data.description || "",
          avatar: data.avatar || "",
          isPublic: data.isPublic ?? true,
        });
      } else {
        toast.error("Fehler beim Laden der Gruppe");
        router.push("/groups");
      }
    } catch (error) {
      toast.error("Fehler beim Laden der Gruppe");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch(`/api/groups/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Gruppe aktualisiert");
        router.push(`/groups/${params.id}`);
      } else {
        const error = await res.json();
        toast.error(error.error || "Fehler beim Aktualisieren");
      }
    } catch (error) {
      toast.error("Fehler beim Aktualisieren der Gruppe");
    } finally {
      setIsSaving(false);
    }
  };

  if (!session) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <p className="mt-2 text-gray-600">Lädt...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Gruppe bearbeiten</h1>
            <p className="text-gray-600">
              Passe Name, Beschreibung und Einstellungen deiner Gruppe an
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar */}
            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-2">
                Gruppenbild (URL)
              </label>
              <input
                id="avatar"
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
              {formData.avatar && (
                <div className="mt-2">
                  <Image
                    src={formData.avatar}
                    alt="Vorschau"
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                    onError={() => toast.error("Bild konnte nicht geladen werden")}
                  />
                </div>
              )}
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Gruppenname *
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>

            {/* Beschreibung */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Beschreibung
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>

            {/* Sichtbarkeit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sichtbarkeit
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isPublic"
                    checked={formData.isPublic === true}
                    onChange={() => setFormData({ ...formData, isPublic: true })}
                    className="text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-gray-700">Öffentlich - Jeder kann die Gruppe finden und beitreten</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isPublic"
                    checked={formData.isPublic === false}
                    onChange={() => setFormData({ ...formData, isPublic: false })}
                    className="text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-gray-700">Privat - Nur mit Einladungs-Link beitretbar</span>
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSaving} className="flex-1">
                {isSaving ? "Speichert..." : "Änderungen speichern"}
              </Button>
              <Link href={`/groups/${params.id}`}>
                <Button type="button" variant="outline">
                  Abbrechen
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

