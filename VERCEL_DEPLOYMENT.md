# Vercel Deployment Guide für AzuBite

## Schnellstart

1. **Repository auf Vercel verbinden**
   - Gehe zu [vercel.com/new](https://vercel.com/new)
   - Importiere das Repository: `adrian1921677/AzuBite`
   - Vercel erkennt automatisch Next.js

2. **Umgebungsvariablen hinzufügen**
   - Siehe Liste unten

3. **Deploy**
   - Klicke auf "Deploy"
   - Fertig! 🎉

## Umgebungsvariablen für Vercel

### Erforderlich

```env
DATABASE_URL=postgresql://neondb_owner:npg_p3iaJ1XWmqlI@ep-wandering-surf-agvfvmw8-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
NEXTAUTH_URL=https://deine-app.vercel.app
NEXTAUTH_SECRET=gyz/P3x+IVGmfkAZXpa9ZlrYsy+aixbDAN6PRZE5OgU=
```

### Optional (für vollständige Funktionalität)

**OAuth Provider:**
```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

**Datei-Upload (AWS S3):**
```env
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=azubite-uploads
```

**Datei-Upload (Cloudflare R2):**
```env
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=azubite-uploads
R2_ENDPOINT=https://...
```

**Algolia Search:**
```env
ALGOLIA_APP_ID=...
ALGOLIA_API_KEY=...
ALGOLIA_INDEX_NAME=reports
```

**E-Mail:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASSWORD=...
SMTP_FROM=AzuBite <noreply@azubite.com>
```

## Build-Prozess

Vercel führt automatisch folgende Schritte aus:

1. `npm install` - Installiert Dependencies
2. `prisma generate` - Generiert Prisma Client (via postinstall)
3. `next build` - Baut die Next.js Anwendung
4. Deployt die Anwendung

## Datenbank-Migrationen

Nach dem ersten Deployment:

```bash
# Lokal ausführen
npx prisma db push
# oder
npx prisma migrate deploy
```

## Troubleshooting

### Build-Fehler: Prisma Client nicht gefunden
- Stelle sicher, dass `postinstall` Script in `package.json` vorhanden ist
- Prüfe, ob `DATABASE_URL` korrekt gesetzt ist

### NextAuth-Fehler
- Stelle sicher, dass `NEXTAUTH_URL` auf die Vercel-URL zeigt
- Prüfe, ob `NEXTAUTH_SECRET` gesetzt ist

### Datei-Upload-Fehler
- Stelle sicher, dass S3/R2 Credentials korrekt sind
- Prüfe Bucket-Berechtigungen

## Support

Bei Problemen:
1. Prüfe Vercel Build-Logs
2. Prüfe Umgebungsvariablen
3. Teste lokal mit `npm run build`

