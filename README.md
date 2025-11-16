# AzuBite

Eine kollaborative Plattform für Auszubildende, die ihre Berichtshefte digital hochladen, teilen und entdecken wollen.

## Features

- 🔐 Nutzer-Registrierung und -Login mit Email/Passwort und Social Logins (Google, GitHub)
- 👤 Nutzerprofilverwaltung mit Avatar
- 📊 Dashboard zur Verwaltung eigener Berichte
- 📄 Berichtsheft-Upload (PDF und DOCX)
- 🔒 Sichtbarkeitseinstellungen (privat, gruppenintern, öffentlich)
- 👥 Communities/Gruppen (öffentlich und privat)
- 💬 Kommentarfunktion mit Thread-Struktur
- ⭐ Bewertungssystem für Berichte
- 🔍 Volltextsuche mit Filtern
- 🔔 Benachrichtigungssystem (In-App und E-Mail)
- 🛡️ Admin Panel zur Moderation

## Tech Stack

- **Frontend**: Next.js 14 (React), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Datenbank**: PostgreSQL mit Prisma ORM
- **Authentifizierung**: NextAuth.js
- **Datei-Upload**: AWS S3 oder Cloudflare R2
- **Suche**: Algolia
- **Deployment**: Vercel

## Setup

1. **Dependencies installieren:**
```bash
npm install
```

2. **Umgebungsvariablen konfigurieren:**
```bash
cp .env.example .env
# Bearbeite .env mit deinen Credentials
```

3. **Datenbank einrichten:**
```bash
# Prisma Client generieren
npm run db:generate

# Datenbank Schema pushen
npm run db:push

# Oder Migrationen erstellen
npm run db:migrate
```

4. **Entwicklungsserver starten:**
```bash
npm run dev
```

Die Anwendung läuft dann auf [http://localhost:3000](http://localhost:3000)

## Projektstruktur

```
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── (auth)/           # Auth-Seiten (Login, Registrierung)
│   ├── dashboard/        # Dashboard
│   ├── reports/          # Berichtsheft-Verwaltung
│   ├── groups/           # Gruppenbereich
│   └── admin/            # Admin Panel
├── components/            # React Komponenten
├── lib/                  # Utilities und Konfiguration
├── prisma/               # Prisma Schema
└── public/               # Statische Assets
```

## Entwicklung

Das Projekt wird modulweise entwickelt. Aktueller Status:

- ✅ Projekt-Setup
- ✅ Datenbankschema
- 🔄 Authentifizierung (in Arbeit)
- ⏳ Berichtsheft-Management
- ⏳ Gruppenmanagement
- ⏳ Kommentar- und Bewertungssystem
- ⏳ Volltextsuche
- ⏳ Benachrichtigungssystem
- ⏳ Admin Panel

## Lizenz

Proprietär


