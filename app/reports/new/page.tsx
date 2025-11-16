"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import toast from "react-hot-toast";

export default function NewReportPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    visibility: "PRIVATE" as "PRIVATE" | "GROUP" | "PUBLIC",
    profession: "",
    trainingYear: "",
    tags: "",
    groupId: "",
  });
  const [groups, setGroups] = useState<any[]>([]);

  // Lade Gruppen beim Mount
  useState(() => {
    fetch("/api/groups/my")
      .then((res) => res.json())
      .then((data) => setGroups(data))
      .catch(() => {});
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validiere Dateityp
      if (
        selectedFile.type !== "application/pdf" &&
        selectedFile.type !==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        toast.error("Nur PDF und DOCX Dateien sind erlaubt");
        return;
      }

      // Validiere Dateigröße (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("Datei ist zu groß (max. 10MB)");
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Bitte wähle eine Datei aus");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Bitte gib einen Titel ein");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Datei hochladen
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const uploadResponse = await fetch("/api/reports/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.error || "Upload fehlgeschlagen");
      }

      const uploadData = await uploadResponse.json();

      // 2. Bericht erstellen
      const reportData = {
        title: formData.title,
        description: formData.description || undefined,
        fileUrl: uploadData.fileUrl,
        fileName: uploadData.fileName,
        fileSize: uploadData.fileSize,
        fileType: uploadData.fileType,
        visibility: formData.visibility,
        profession: formData.profession || undefined,
        trainingYear: formData.trainingYear
          ? parseInt(formData.trainingYear)
          : undefined,
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : [],
        groupId: formData.groupId || undefined,
      };

      const reportResponse = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportData),
      });

      if (!reportResponse.ok) {
        const error = await reportResponse.json();
        throw new Error(error.error || "Fehler beim Erstellen des Berichts");
      }

      const report = await reportResponse.json();

      toast.success("Bericht erfolgreich hochgeladen!");
      router.push(`/reports/${report.id}`);
    } catch (error: any) {
      toast.error(error.message || "Ein Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6">Neuen Bericht hochladen</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Datei-Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Berichtsheft (PDF oder DOCX)
              </label>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                required
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  Ausgewählt: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            {/* Titel */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Titel *
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Beschreibung */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Beschreibung
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Sichtbarkeit */}
            <div>
              <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 mb-1">
                Sichtbarkeit
              </label>
              <select
                id="visibility"
                value={formData.visibility}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    visibility: e.target.value as "PRIVATE" | "GROUP" | "PUBLIC",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="PRIVATE">Privat (nur ich)</option>
                <option value="GROUP">Gruppe</option>
                <option value="PUBLIC">Öffentlich</option>
              </select>
            </div>

            {/* Gruppe (wenn Sichtbarkeit = GROUP) */}
            {formData.visibility === "GROUP" && (
              <div>
                <label htmlFor="groupId" className="block text-sm font-medium text-gray-700 mb-1">
                  Gruppe
                </label>
                <select
                  id="groupId"
                  value={formData.groupId}
                  onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Gruppe auswählen</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Beruf */}
            <div>
              <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-1">
                Beruf
              </label>
              <input
                id="profession"
                type="text"
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                placeholder="z.B. Fachinformatiker für Anwendungsentwicklung"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Ausbildungsjahr */}
            <div>
              <label htmlFor="trainingYear" className="block text-sm font-medium text-gray-700 mb-1">
                Ausbildungsjahr
              </label>
              <select
                id="trainingYear"
                value={formData.trainingYear}
                onChange={(e) => setFormData({ ...formData, trainingYear: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Auswählen</option>
                <option value="1">1. Jahr</option>
                <option value="2">2. Jahr</option>
                <option value="3">3. Jahr</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags (kommagetrennt)
              </label>
              <input
                id="tags"
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="z.B. Projektarbeit, Praktikum, Theorie"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Lädt..." : "Bericht hochladen"}
              </Button>
              <Link href="/dashboard">
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

