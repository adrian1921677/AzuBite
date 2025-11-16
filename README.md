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

## Deployment auf Vercel

### Voraussetzungen

1. **Vercel-Konto** erstellen: [vercel.com](https://vercel.com)
2. **GitHub-Repository** verbinden

### Deployment-Schritte

1. **Repository auf Vercel verbinden:**
   - Gehe zu [vercel.com/new](https://vercel.com/new)
   - Importiere das GitHub-Repository `adrian1921677/AzuBite`
   - Vercel erkennt automatisch Next.js

2. **Umgebungsvariablen konfigurieren:**
   
   In den Vercel-Projekt-Einstellungen → Environment Variables folgende Variablen hinzufügen:

   **Datenbank:**
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_p3iaJ1XWmqlI@ep-wandering-surf-agvfvmw8-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

   **NextAuth:**
   ```
   NEXTAUTH_URL=https://deine-app.vercel.app
   NEXTAUTH_SECRET=gyz/P3x+IVGmfkAZXpa9ZlrYsy+aixbDAN6PRZE5OgU=
   ```

   **OAuth (optional):**
   ```
   GOOGLE_CLIENT_ID=deine-google-client-id
   GOOGLE_CLIENT_SECRET=dein-google-client-secret
   GITHUB_CLIENT_ID=deine-github-client-id
   GITHUB_CLIENT_SECRET=dein-github-client-secret
   ```

   **AWS S3 / Cloudflare R2 (optional):**
   ```
   AWS_ACCESS_KEY_ID=dein-access-key
   AWS_SECRET_ACCESS_KEY=dein-secret-key
   AWS_REGION=us-east-1
   AWS_S3_BUCKET_NAME=azubite-uploads
   ```

   **Algolia (optional):**
   ```
   ALGOLIA_APP_ID=deine-algolia-app-id
   ALGOLIA_API_KEY=dein-algolia-api-key
   ALGOLIA_INDEX_NAME=reports
   ```

   **E-Mail (optional):**
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=deine-email@gmail.com
   SMTP_PASSWORD=dein-app-password
   SMTP_FROM=AzuBite <noreply@azubite.com>
   ```

3. **Build-Einstellungen:**
   - Build Command: `prisma generate && next build` (automatisch durch `vercel.json`)
   - Output Directory: `.next` (automatisch)
   - Install Command: `npm install` (automatisch)

4. **Deploy:**
   - Klicke auf "Deploy"
   - Vercel baut die Anwendung automatisch
   - Nach erfolgreichem Build ist die App live

### Wichtige Hinweise

- **Prisma Client:** Wird automatisch während des Builds generiert (`postinstall` Script)
- **Datenbank-Migrationen:** Führe `prisma db push` lokal aus oder nutze Prisma Migrate
- **Umgebungsvariablen:** Werden automatisch in alle Umgebungen (Production, Preview, Development) übernommen
- **Serverless Functions:** Alle API-Routen laufen als Serverless Functions auf Vercel

## Entwicklung

Das Projekt wird modulweise entwickelt. Aktueller Status:

- ✅ Projekt-Setup
- ✅ Datenbankschema
- ✅ Authentifizierung
- ✅ Berichtsheft-Management
- ✅ Gruppenmanagement
- ✅ Kommentar- und Bewertungssystem
- ✅ Benachrichtigungssystem
- ⏳ Volltextsuche (Algolia Integration)
- ⏳ Admin Panel
- ✅ Vercel-Deployment vorbereitet

## Lizenz

Proprietär


