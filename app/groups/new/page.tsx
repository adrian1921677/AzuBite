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

export default function NewGroupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarMethod, setAvatarMethod] = useState<"url" | "upload">("url");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    avatar: "",
    isPublic: true,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <p className="mt-2 text-gray-600">Lädt...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validiere Dateityp
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error("Nur Bilddateien (JPEG, PNG, WebP, GIF) sind erlaubt");
        return;
      }

      // Validiere Dateigröße (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("Bild ist zu groß (max. 5MB)");
        return;
      }

      setAvatarFile(selectedFile);
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) {
      toast.error("Bitte wähle ein Bild aus");
      return;
    }

    setIsUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", avatarFile);

      const res = await fetch("/api/groups/avatar/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData({ ...formData, avatar: data.url });
        toast.success("Bild erfolgreich hochgeladen!");
        setAvatarFile(null);
      } else {
        const error = await res.json();
        toast.error(error.error || "Fehler beim Hochladen");
      }
    } catch (error) {
      toast.error("Fehler beim Hochladen des Bildes");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Entferne leeres Avatar-Feld
      const submitData = {
        ...formData,
        avatar: formData.avatar.trim() || undefined,
      };

      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Gruppe erfolgreich erstellt!");
        router.push(`/groups/${data.id}`);
      } else {
        const error = await res.json();
        toast.error(error.error || "Fehler beim Erstellen der Gruppe");
      }
    } catch (error) {
      toast.error("Fehler beim Erstellen der Gruppe");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Neue Gruppe erstellen</h1>
            <p className="text-gray-600">
              Erstelle eine neue Gruppe und lade Freunde ein
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gruppenbild
              </label>
              
              {/* Tabs für URL oder Upload */}
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setAvatarMethod("url")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    avatarMethod === "url"
                      ? "bg-primary-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  URL eingeben
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarMethod("upload")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    avatarMethod === "upload"
                      ? "bg-primary-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Bild hochladen
                </button>
              </div>

              {avatarMethod === "url" ? (
                <>
                  <input
                    id="avatar"
                    type="url"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </>
              ) : (
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                  {avatarFile && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {avatarFile.name} ({(avatarFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleUploadAvatar}
                        disabled={isUploading}
                      >
                        {isUploading ? "Lädt..." : "Hochladen"}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {formData.avatar && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Vorschau:</p>
                  <Image
                    src={formData.avatar}
                    alt="Vorschau"
                    width={120}
                    height={120}
                    className="rounded-lg object-cover border border-gray-200"
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
                placeholder="z.B. IT-Azubis 2024"
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
                placeholder="Beschreibe deine Gruppe..."
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
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Erstellt..." : "Gruppe erstellen"}
              </Button>
              <Link href="/groups">
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

