// Ausbildungsberufe nach Berufsfeldern strukturiert
// Basierend auf BERUF AKTUELL 2024/2025 der Bundesagentur für Arbeit

export interface ProfessionCategory {
  id: string;
  name: string;
  professions: string[];
}

export const professionCategories: ProfessionCategory[] = [
  {
    id: "it",
    name: "IT & Informatik",
    professions: [
      "Fachinformatiker/in - Anwendungsentwicklung",
      "Fachinformatiker/in - Systemintegration",
      "IT-Systemelektroniker/in",
      "IT-System-Kaufmann/-frau",
      "Informatikkaufmann/-frau",
      "Kaufmann/-frau für IT-System-Management",
      "Mathematisch-technische/r Softwareentwickler/in",
      "Mediengestalter/in Digital und Print - Gestaltung und Technik",
    ],
  },
  {
    id: "technik",
    name: "Technik & Handwerk",
    professions: [
      "Elektroniker/in - Betriebstechnik",
      "Elektroniker/in - Energie- und Gebäudetechnik",
      "Elektroniker/in - Geräte und Systeme",
      "Mechatroniker/in",
      "Industriemechaniker/in",
      "Zerspanungsmechaniker/in",
      "Werkzeugmechaniker/in",
      "Anlagenmechaniker/in für Sanitär-, Heizungs- und Klimatechnik",
      "Kfz-Mechatroniker/in",
      "Kraftfahrzeugmechatroniker/in",
    ],
  },
  {
    id: "wirtschaft",
    name: "Wirtschaft & Verwaltung",
    professions: [
      "Kaufmann/-frau im Einzelhandel",
      "Kaufmann/-frau für Büromanagement",
      "Industriekaufmann/-frau",
      "Bürokaufmann/-frau",
      "Kaufmann/-frau für Spedition und Logistikdienstleistung",
      "Kaufmann/-frau im Groß- und Außenhandel",
      "Bankkaufmann/-frau",
      "Verkäufer/in",
      "Immobilienkaufmann/-frau",
    ],
  },
  {
    id: "gesundheit",
    name: "Gesundheit & Soziales",
    professions: [
      "Altenpfleger/in",
      "Erzieher/in",
      "Gesundheits- und Krankenpfleger/in",
      "Medizinische/r Fachangestellte/r",
      "Zahnmedizinische/r Fachangestellte/r",
      "Pharmazeutisch-kaufmännische/r Angestellte/r",
      "Sozialassistent/in",
    ],
  },
  {
    id: "medien",
    name: "Medien & Gestaltung",
    professions: [
      "Mediengestalter/in Bild und Ton",
      "Fotograf/in",
      "Gestalter/in für visuelles Marketing",
      "Mediengestalter/in Digital und Print",
      "Kaufmann/-frau für Marketingkommunikation",
    ],
  },
  {
    id: "gastronomie",
    name: "Gastronomie & Tourismus",
    professions: [
      "Koch/Köchin",
      "Restaurantfachmann/-frau",
      "Hotelfachmann/-frau",
      "Fachkraft im Gastgewerbe",
      "Tourismuskaufmann/-frau",
    ],
  },
  {
    id: "bau",
    name: "Bau & Architektur",
    professions: [
      "Maurer/in",
      "Zimmerer/Zimmerin",
      "Fliesenleger/in",
      "Maler/in und Lackierer/in",
      "Tischler/in",
      "Straßenbauer/in",
      "Bauzeichner/in",
    ],
  },
  {
    id: "handel",
    name: "Handel & Verkauf",
    professions: [
      "Kaufmann/-frau im Einzelhandel",
      "Verkäufer/in",
      "Fachverkäufer/in im Lebensmittelhandwerk",
      "Kaufmann/-frau im E-Commerce",
    ],
  },
];

// Alle Berufe als flache Liste für Suche
export const allProfessions: string[] = professionCategories.flatMap(
  (category) => category.professions
);

// Funktion zum Finden einer Kategorie nach Beruf
export function findCategoryByProfession(
  profession: string
): ProfessionCategory | undefined {
  return professionCategories.find((category) =>
    category.professions.includes(profession)
  );
}

// Funktion zum Filtern von Berufen nach Suchbegriff
export function searchProfessions(query: string): string[] {
  const lowerQuery = query.toLowerCase();
  return allProfessions.filter((profession) =>
    profession.toLowerCase().includes(lowerQuery)
  );
}

