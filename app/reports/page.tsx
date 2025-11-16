"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { professionCategories, allProfessions } from "@/lib/data/professions";
import { EmptyStateMascot } from "@/components/ui/mascot";
import toast from "react-hot-toast";

export default function ReportsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category") || null
  );
  const [selectedProfession, setSelectedProfession] = useState<string | null>(
    searchParams.get("profession") || null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }
    loadReports();
  }, [session, selectedProfession]);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("visibility", "PUBLIC");
      if (selectedProfession) {
        params.append("profession", selectedProfession);
      }

      const res = await fetch(`/api/reports?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      } else {
        toast.error("Fehler beim Laden der Berichte");
      }
    } catch (error) {
      toast.error("Fehler beim Laden der Berichte");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      setSelectedProfession(null);
    } else {
      setSelectedCategory(categoryId);
      setSelectedProfession(null);
    }
  };

  const handleProfessionSelect = (profession: string) => {
    setSelectedProfession(profession);
    setSelectedCategory(null);
    router.push(`/reports?profession=${encodeURIComponent(profession)}`);
  };

  const filteredProfessions = selectedCategory
    ? professionCategories.find((cat) => cat.id === selectedCategory)?.professions || []
    : allProfessions;

  const searchedProfessions = searchQuery
    ? filteredProfessions.filter((p) =>
        p.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredProfessions;

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Berichte</h1>
          <p className="text-gray-600">
            Entdecke Berichtshefte von anderen Auszubildenden
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Nach Ausbildungsberuf filtern</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Filter ausblenden" : "Filter anzeigen"}
            </Button>
          </div>

          {showFilters && (
            <div className="space-y-4">
              {/* Suchfeld */}
              <div>
                <input
                  type="text"
                  placeholder="Beruf suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Kategorien */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {professionCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? "bg-primary-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Berufe */}
              {searchedProfessions.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    {selectedCategory
                      ? professionCategories.find((c) => c.id === selectedCategory)?.name
                      : "Alle Berufe"}
                  </h3>
                  <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {searchedProfessions.map((profession) => (
                  <button
                    key={profession}
                    onClick={() => handleProfessionSelect(profession)}
                    className={`px-3 py-2 text-left text-sm rounded-md transition-colors ${
                      selectedProfession === profession
                        ? "bg-primary-100 text-primary-700 border-2 border-primary-500"
                        : "bg-white hover:bg-gray-50 border border-gray-200 text-gray-900"
                    }`}
                  >
                    {profession}
                  </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Aktiver Filter */}
              {selectedProfession && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Aktiver Filter:</span>
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                    {selectedProfession}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-700 hover:text-gray-900"
                    onClick={() => {
                      setSelectedProfession(null);
                      setSelectedCategory(null);
                      router.push("/reports");
                    }}
                  >
                    ✕ Zurücksetzen
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Feed */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <p className="mt-2 text-gray-600">Lädt Berichte...</p>
          </div>
        ) : reports.length === 0 ? (
          <EmptyStateMascot
            message={
              selectedProfession
                ? `Noch keine Berichte für "${selectedProfession}" vorhanden.`
                : "Noch keine öffentlichen Berichte vorhanden."
            }
            action={
              <Link href="/reports/new">
                <Button>Ersten Bericht hochladen</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <Link
                key={report.id}
                href={`/reports/${report.id}`}
                className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  {report.author.image ? (
                    <Image
                      src={report.author.image}
                      alt={report.author.name || "Autor"}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                      {(report.author.name || "A")[0].toUpperCase()}
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {report.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {report.author.name || "Unbekannt"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>⭐ {report.averageRating.toFixed(1)}</span>
                        <span>•</span>
                        <span>{report._count.comments} Kommentare</span>
                      </div>
                    </div>

                    {report.description && (
                      <p className="text-gray-700 mb-3 line-clamp-2">
                        {report.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span>
                        {format(new Date(report.createdAt), "dd.MM.yyyy", {
                          locale: de,
                        })}
                      </span>
                      {report.profession && (
                        <>
                          <span>•</span>
                          <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded">
                            {report.profession}
                          </span>
                        </>
                      )}
                      {report.trainingYear && (
                        <>
                          <span>•</span>
                          <span>{report.trainingYear}. Ausbildungsjahr</span>
                        </>
                      )}
                      {report.tags && report.tags.length > 0 && (
                        <>
                          <span>•</span>
                          <div className="flex gap-1">
                            {report.tags.slice(0, 3).map((tag: string) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

