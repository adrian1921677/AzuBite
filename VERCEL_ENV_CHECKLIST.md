# Vercel Umgebungsvariablen Checkliste

## ✅ ERFORDERLICH (Muss gesetzt werden)

Diese Variablen sind **absolut notwendig** für die Anwendung:

```env
DATABASE_URL=postgresql://neondb_owner:npg_p3iaJ1XWmqlI@ep-wandering-surf-agvfvmw8-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
NEXTAUTH_URL=https://deine-app.vercel.app
NEXTAUTH_SECRET=gyz/P3x+IVGmfkAZXpa9ZlrYsy+aixbDAN6PRZE5OgU=
```

**Wichtig:**
- `NEXTAUTH_URL` muss auf deine Vercel-URL zeigen (z.B. `https://azubite.vercel.app`)
- Nach dem ersten Deploy findest du die URL in den Vercel-Projekt-Einstellungen
- Falls die URL noch nicht bekannt ist, kannst du temporär `http://localhost:3000` verwenden und später aktualisieren

## ⚠️ Häufige Fehlerquellen

### 1. DATABASE_URL fehlt oder ist falsch
**Symptom:** "Application error: a server-side exception has occurred"
**Lösung:** Prüfe, ob `DATABASE_URL` korrekt in Vercel gesetzt ist

### 2. NEXTAUTH_SECRET fehlt
**Symptom:** NextAuth funktioniert nicht
**Lösung:** Stelle sicher, dass `NEXTAUTH_SECRET` gesetzt ist

### 3. NEXTAUTH_URL ist falsch
**Symptom:** Redirects funktionieren nicht
**Lösung:** Setze `NEXTAUTH_URL` auf deine Vercel-URL

## 📋 So fügst du Umgebungsvariablen in Vercel hinzu

1. Gehe zu deinem Vercel-Projekt
2. Klicke auf **Settings** → **Environment Variables**
3. Füge jede Variable einzeln hinzu:
   - **Key:** z.B. `DATABASE_URL`
   - **Value:** Der entsprechende Wert
   - **Environment:** Wähle alle aus (Production, Preview, Development)
4. Klicke auf **Save**
5. **WICHTIG:** Nach dem Hinzufügen neuer Variablen muss ein neuer Deploy gemacht werden!

## 🔍 Debugging

Falls du weiterhin Fehler siehst:

1. **Prüfe die Vercel Build-Logs:**
   - Gehe zu Deployments → Klicke auf den neuesten Deploy → Sieh dir die Logs an

2. **Prüfe die Runtime-Logs:**
   - Gehe zu Deployments → Klicke auf Functions → Sieh dir die Logs an

3. **Teste lokal:**
   ```bash
   npm run build
   npm start
   ```

4. **Prüfe ob alle Umgebungsvariablen gesetzt sind:**
   - In Vercel: Settings → Environment Variables
   - Stelle sicher, dass alle erforderlichen Variablen vorhanden sind

## 🚀 Nach dem ersten Deploy

1. Kopiere deine Vercel-URL (z.B. `https://azubite-xyz.vercel.app`)
2. Gehe zu Settings → Environment Variables
3. Aktualisiere `NEXTAUTH_URL` auf deine Vercel-URL
4. Mache einen neuen Deploy

