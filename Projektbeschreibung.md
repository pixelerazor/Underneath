## 🚀 **Hier ist dein komplettes Setup-Script für Continue:**

````bash
#!/usr/bin/env bash
# setup-continue-context.sh - Erstellt alle Continue Context Dateien für Underneath
# Gibt Continue/Claude kompletten Überblick über das Projekt

set -euo pipefail

# Farben für Output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}     Underneath - Continue Context Setup${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""

# Ins Projekt-Verzeichnis wechseln
cd ~/Dokumente/Testumgebung\ Bashscript/Test_001/underneath || {
    echo -e "${YELLOW}⚠️  Projekt-Verzeichnis nicht gefunden!${NC}"
    echo "Erwarteter Pfad: ~/Dokumente/Testumgebung Bashscript/Test_001/underneath"
    exit 1
}

echo -e "${GREEN}✓${NC} Projekt-Verzeichnis gefunden"
echo -e "${BLUE}►${NC} Erstelle Continue Context Ordner..."

# Continue Ordner erstellen
mkdir -p .continue-context

# ========================================
# 1. HAUPTKONTEXT - Die wichtigste Datei
# ========================================
cat > .continue-context/01-PROJECT-OVERVIEW.md << 'EOF'
# UNDERNEATH - VOLLSTÄNDIGE PROJEKTÜBERSICHT FÜR CLAUDE/CONTINUE

## 🚨 KRITISCH WICHTIG - IMMER ZUERST LESEN!

### Über den Entwickler
- **ICH BIN PROGRAMMIER-ANFÄNGER/LAIE!**
- Ich verstehe keine komplexen Konzepte ohne Erklärung
- Ich brauche IMMER genaue Anweisungen wo welche Datei hinkommt
- Ich brauche KOMPLETTEN Code, keine Snippets mit "..."
- Erkläre mir alles wie einem 10-Jährigen
- Zeige mir JEDEN Befehl den ich ausführen muss
- Wenn etwas schief geht, nicht verzweifeln - einfach nochmal erklären

### Was ist Underneath?
**Underneath ist ein Beziehungs-Management-Framework für DS-Beziehungen (Dominanz/Submission).**

Es ist eine Web-App die hilft, asymmetrische Beziehungen zu strukturieren, mit:
- Aufgaben und Regeln
- Belohnungen und Strafen
- Fortschritts-Tracking
- Stufenmodellen
- Kommunikation zwischen Partnern

### Die drei Haupt-Rollen

1. **DOM (Dominant)**
   - Hat vollständige Kontrolle über die Beziehungsstruktur
   - Erstellt und verwaltet Regeln, Aufgaben, Strafen
   - Sieht alle Daten und Fortschritte
   - Kann Stufenmodelle definieren
   - Vergibt Belohnungen und Strafen
   - Hat Zugriff auf alle Admin-Funktionen

2. **SUB (Submissive)**
   - Empfängt Aufgaben und befolgt Regeln
   - Kann eigenen Fortschritt einsehen
   - Lädt Nachweise/Belege hoch
   - Erhält Belohnungen und Strafen
   - Eingeschränkte Sicht (nur was DOM freigibt)
   - Kann Feedback geben

3. **OBSERVER (Beobachter)**
   - Read-only Zugriff für Supervision
   - Kann Statistiken einsehen
   - Keine Bearbeitungsrechte
   - Für Mediatoren oder Therapeuten gedacht

### Technologie-Stack (FESTGELEGT - NICHT ÄNDERN!)

#### Frontend
- **React 18** mit TypeScript (strict mode!)
- **Vite** als Build-Tool
- **Tailwind CSS** für Styling
- **shadcn/ui** für UI-Komponenten
- **React Router** für Navigation
- **Zustand** für State Management
- **React Query** für API-Calls
- **React Hook Form + Zod** für Formulare

#### Backend
- **Node.js 20** mit Express
- **TypeScript** überall
- **Passport.js** für Authentication
- **JWT** für Sessions (Access: 15min, Refresh: 7 Tage)
- **bcrypt** für Passwort-Hashing (12 rounds)
- **Prisma ORM** für Datenbank
- **Redis** für Caching
- **Multer** für File-Uploads

#### Datenbank & Infrastructure
- **PostgreSQL 16** als Hauptdatenbank
- **Redis 7** für Sessions/Cache
- **Docker Compose** für Development
- **Später: Self-hosted auf NAS** (KEIN CLOUD!)

### Design-System (EXAKT SO UMSETZEN!)

#### Farbschema - NUR DARK MODE!
```css
/* Diese Farben IMMER verwenden */
--background: #0a0a0a;     /* Fast schwarz */
--surface: #1a1a1a;        /* Dunkelgrau für Karten */
--border: #2a2a2a;         /* Grau für Borders */
--primary: #dc2626;        /* Rot (Dominanz) */
--primary-hover: #991b1b;  /* Dunkelrot */
--text: #fafafa;           /* Fast weiß */
--text-muted: #a3a3a3;     /* Grau für unwichtigen Text */
--success: #10b981;        /* Grün für Erfolg */
--warning: #f59e0b;        /* Orange für Warnungen */
--error: #ef4444;          /* Hellrot für Fehler */
````

#### UI-Prinzipien

- **Mobile-first** responsive Design
- Große Touch-Targets (min 44x44px)
- Hoher Kontrast für Lesbarkeit
- Smooth Animations (Framer Motion)
- Karten-basiertes Layout
- Keine hellen Themes!

### Projekt-Struktur (SO IST ES ORGANISIERT)

```
underneath/
├── .continue-context/     ← DIESE DATEIEN HIER
├── frontend/
│   ├── src/
│   │   ├── pages/        ← Seiten-Komponenten
│   │   ├── components/   ← Wiederverwendbare UI
│   │   ├── hooks/        ← Custom React Hooks
│   │   ├── services/     ← API-Calls
│   │   ├── stores/       ← Zustand Stores
│   │   ├── types/        ← TypeScript Types
│   │   └── lib/          ← Utilities
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/       ← API Endpoints
│   │   ├── middleware/   ← Auth, Validation
│   │   ├── services/     ← Business Logic
│   │   ├── controllers/  ← Route Handler
│   │   └── types/        ← TypeScript Types
│   └── package.json
├── prisma/
│   ├── schema.prisma     ← Datenbank-Schema
│   └── migrations/       ← DB-Migrations
├── docker-compose.yml    ← Container-Setup
└── .env                  ← Geheime Variablen
```

### API-Design Patterns

#### Endpoints Format

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/refresh
POST   /api/auth/logout

GET    /api/users          (DOM only)
GET    /api/users/:id      (DOM only)
PUT    /api/users/:id      (Own profile or DOM)

GET    /api/tasks          (Own tasks or all for DOM)
POST   /api/tasks          (DOM only)
PUT    /api/tasks/:id      (DOM only)
DELETE /api/tasks/:id      (DOM only)
POST   /api/tasks/:id/complete (SUB only)

GET    /api/rules          (All can read)
POST   /api/rules          (DOM only)
PUT    /api/rules/:id      (DOM only)
```

#### Response Format

```typescript
// Erfolg
{
  success: true,
  data: any,
  message?: string
}

// Fehler
{
  success: false,
  error: string,
  details?: any
}
```

### Sicherheits-Anforderungen (NICHT VERHANDELBAR!)

1. **Authentication & Authorization**

   - JWT-basiert (niemals Sessions)
   - Refresh Token Rotation
   - Rate Limiting auf allen Endpoints
   - Brute-Force Protection

2. **Daten-Validierung**

   - ALLE Inputs mit Zod validieren
   - SQL Injection Prevention (Prisma)
   - XSS Protection (React escaped automatisch)
   - CSRF Tokens für State-ändernde Operationen

3. **Rollen-Checks**

   - Bei JEDER Route Rolle prüfen
   - Prinzip: Least Privilege
   - Explizite Erlaubnis, nicht implizit

4. **Datenschutz**
   - DSGVO-konform
   - Daten-Verschlüsselung at rest
   - Keine Cookies für Tracking
   - Recht auf Löschung implementieren

### Aktueller Entwicklungsstand (Januar 2025)

#### ✅ Fertig

- Docker-Entwicklungsumgebung läuft
- Basis-Projektstruktur erstellt
- PostgreSQL + Redis laufen
- User-Model mit Rollen definiert
- TypeScript konfiguriert
- Tailwind mit Dark Theme eingerichtet
- PWA-Grundlagen konfiguriert
- Passport.js installiert

#### 🚧 In Arbeit

- Passport.js Konfiguration
- JWT-Strategie Implementation

#### ❌ Noch zu tun (Priorität)

1. **Authentication fertigstellen**

   - Login/Register Endpoints
   - JWT Middleware
   - Refresh Token Logic
   - Password Reset

2. **Frontend Auth**

   - Login-Seite
   - Register-Seite mit Rollen
   - Auth Context/Store
   - Protected Routes
   - Auto-Logout

3. **Dashboards**

   - DOM Dashboard
   - SUB Dashboard
   - OBSERVER Dashboard

4. **Kern-Features**
   - Aufgaben-System
   - Regeln-Verwaltung
   - Strafen/Belohnungen
   - Stufenmodelle
   - Fortschritts-Tracking

### Entwicklungs-Philosophie

1. **Iterativ & Inkrementell**

   - Kleine, funktionierende Schritte
   - Erst Basis, dann Features
   - Immer testbar halten

2. **Mobile-First**

   - Erst für Smartphone
   - Dann für Tablet
   - Desktop als Bonus

3. **Offline-First**

   - PWA-Fähigkeiten nutzen
   - Lokales Caching
   - Sync wenn online

4. **Privacy-First**
   - Daten gehören den Nutzern
   - Selbst-gehostet
   - Keine Analytics

### Code-Standards (BEI JEDEM CODE BEACHTEN!)

```typescript
// ✅ GUT - So soll Code aussehen:
interface UserDto {
  id: string;
  email: string;
  role: UserRole;
}

async function getUserById(id: string): Promise<UserDto> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, role: true },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
}

// ❌ SCHLECHT - So nicht:
function getUser(id: any) {
  return prisma.user.findUnique({ where: { id } });
}
```

### Git Commit Konventionen

```
feat: Neues Feature
fix: Bugfix
docs: Dokumentation
style: Formatierung
refactor: Code-Umstrukturierung
test: Tests
chore: Wartung
```

### WICHTIGE WARNUNGEN ⚠️

1. **NIEMALS** echte Passwörter in Code/Git!
2. **NIEMALS** any-Type in TypeScript (außer absolut nötig)
3. **NIEMALS** console.log in Production
4. **NIEMALS** unvalidierte User-Inputs nutzen
5. **NIEMALS** synchrone Operationen die blockieren
6. **IMMER** Error Handling implementieren
7. **IMMER** TypeScript strict mode
8. **IMMER** Rollen checken

### Bei Problemen

Wenn etwas nicht funktioniert:

1. Docker-Logs checken: `docker compose logs -f`
2. Browser-Console checken: F12
3. TypeScript-Fehler checken: `npm run type-check`
4. Mir GENAU sagen was die Fehlermeldung ist

## ENDE DER HAUPTÜBERSICHT

Bei JEDER Antwort diese Datei beachten!
EOF

echo -e "${GREEN}✓${NC} PROJECT-OVERVIEW.md erstellt"

# ========================================

# 2. AKTUELLER STATUS

# ========================================

cat > .continue-context/02-CURRENT-STATUS.md << 'EOF'

# AKTUELLER ENTWICKLUNGSSTAND

## Letzte Aktivität: 15. Januar 2025

### Was funktioniert bereits:

- ✅ Docker-Container laufen (Frontend, Backend, PostgreSQL, Redis)
- ✅ Frontend erreichbar unter http://localhost:5173
- ✅ Backend Health-Check unter http://localhost:3000/health
- ✅ Datenbank-Verbindung steht
- ✅ Prisma Schema mit User-Model definiert
- ✅ TypeScript in Frontend und Backend konfiguriert
- ✅ Tailwind CSS mit Dark Theme
- ✅ Basic PWA Setup

### Was gerade entwickelt wird:

- 🚧 Authentication System mit Passport.js
  - [x] Passport installiert
  - [ ] Local Strategy konfigurieren
  - [ ] JWT Strategy konfigurieren
  - [ ] Register Endpoint
  - [ ] Login Endpoint
  - [ ] Middleware für Protected Routes

### Nächste Schritte (in dieser Reihenfolge!):

1. Passport Konfiguration fertigstellen
2. Register-Endpoint mit Rollen-Auswahl
3. Login-Endpoint mit JWT-Generierung
4. Auth-Middleware für Route-Protection
5. Frontend Login-Seite
6. Frontend Register-Seite
7. Auth-Store mit Zustand
8. Protected Routes im Frontend
9. Erste Dashboard-Version (unterschiedlich pro Rolle)

### Bekannte Probleme:

- Keine aktuell

### Test-Accounts (noch nicht implementiert):

```
DOM Account:
Email: dom@underneath.local
Password: Test123!
Role: DOM

SUB Account:
Email: sub@underneath.local
Password: Test123!
Role: SUB

OBSERVER Account:
Email: observer@underneath.local
Password: Test123!
Role: OBSERVER
```

### Wichtige Dateien:

- Schema: `prisma/schema.prisma`
- Backend Entry: `backend/src/index.ts`
- Frontend Entry: `frontend/src/main.tsx`
- Docker Config: `docker-compose.yml`
- Environment: `.env`
  EOF

echo -e "${GREEN}✓${NC} CURRENT-STATUS.md erstellt"

# ========================================

# 3. ENTWICKLUNGSPLAN

# ========================================

cat > .continue-context/03-DEVELOPMENT-PLAN.md << 'EOF'

# ENTWICKLUNGSPLAN - SCHRITT FÜR SCHRITT

## Phase 1: Authentication (JETZT)

**Ziel:** Nutzer können sich registrieren und einloggen

### Backend Tasks:

1. [ ] Passport Local Strategy einrichten
2. [ ] Passport JWT Strategy einrichten
3. [ ] POST /api/auth/register
   - Email, Password, Role
   - Password hashen mit bcrypt
   - User in DB speichern
   - JWT zurückgeben
4. [ ] POST /api/auth/login
   - Email/Password validieren
   - JWT generieren
   - Refresh Token speichern
5. [ ] GET /api/auth/me
   - Current User aus JWT
6. [ ] POST /api/auth/refresh
   - Neuen Access Token generieren
7. [ ] Middleware: requireAuth
8. [ ] Middleware: requireRole(['DOM', 'SUB'])

### Frontend Tasks:

1. [ ] Login-Seite (Dark Theme!)
2. [ ] Register-Seite mit Rollen-Dropdown
3. [ ] Auth Service (API Calls)
4. [ ] Auth Store (Zustand)
5. [ ] ProtectedRoute Component
6. [ ] Auto-Refresh Logic
7. [ ] Logout-Funktion

## Phase 2: Dashboards (Nach Auth)

**Ziel:** Jede Rolle sieht ihr eigenes Dashboard

### DOM Dashboard:

- [ ] Übersicht aller SUBs
- [ ] Quick-Actions (Aufgabe erstellen, etc.)
- [ ] Statistiken
- [ ] Letzte Aktivitäten

### SUB Dashboard:

- [ ] Eigene Aufgaben
- [ ] Aktueller Fortschritt
- [ ] Anstehende Deadlines
- [ ] Belohnungen/Strafen

### OBSERVER Dashboard:

- [ ] Read-only Statistiken
- [ ] Beziehungs-Übersicht

## Phase 3: Aufgaben-System

**Ziel:** DOM kann Aufgaben erstellen, SUB kann sie abarbeiten

- [ ] Aufgaben-Model in Prisma
- [ ] CRUD Endpoints für Aufgaben
- [ ] Aufgaben-Liste (Frontend)
- [ ] Aufgaben-Detail-Seite
- [ ] Aufgabe als erledigt markieren
- [ ] Datei-Upload für Nachweise

## Phase 4: Regeln & Strafen

**Ziel:** Regelwerk mit Konsequenzen

- [ ] Regeln-Model
- [ ] Strafen-Model
- [ ] Verknüpfung Regel-Verstoß → Strafe
- [ ] Strafen-Verwaltung (DOM)
- [ ] Strafen-Ansicht (SUB)

## Phase 5: Stufenmodell

**Ziel:** Progressions-System

- [ ] Stufen-Model
- [ ] Aufstiegs-Kriterien
- [ ] Automatische Level-Berechnung
- [ ] Visualisierung

## Phase 6: Kommunikation

**Ziel:** In-App Messaging

- [ ] Message-Model
- [ ] Chat-Interface
- [ ] Push-Notifications

## Phase 7: Health-Tracking

**Ziel:** Gesundheitsdaten einbeziehen

- [ ] Health-Data Model
- [ ] Import von Fitness-Apps
- [ ] Ziele und Tracking

## Phase 8: Mobile App

**Ziel:** Native App Experience

- [ ] PWA optimieren
- [ ] Offline-Support
- [ ] Push Notifications
- [ ] App Store (optional)

## Phase 9: Deployment

**Ziel:** Auf NAS lauffähig

- [ ] Production Docker Images
- [ ] Backup-Strategie
- [ ] Update-Mechanismus
- [ ] Monitoring

## Phase 10: Polish

**Ziel:** Feinschliff

- [ ] Performance-Optimierung
- [ ] Accessibility
- [ ] i18n (Deutsch/Englisch)
- [ ] Onboarding-Tour
- [ ] Hilfe-System
      EOF

echo -e "${GREEN}✓${NC} DEVELOPMENT-PLAN.md erstellt"

# ========================================

# 4. PROMPTS FÜR CONTINUE

# ========================================

cat > .continue-context/04-CONTINUE-PROMPTS.md << 'EOF'

# VORGEFERTIGTE PROMPTS FÜR CONTINUE/CLAUDE

## 🚀 Projekt-Status verstehen

```
@file .continue-context/01-PROJECT-OVERVIEW.md
@file .continue-context/02-CURRENT-STATUS.md
@file prisma/schema.prisma
@workspace

Ich bin Programmier-Anfänger und entwickle Underneath.
Analysiere den aktuellen Stand und erkläre mir:
1. Was bereits funktioniert
2. Was als nächstes zu tun ist
3. Welche Datei ich wo bearbeiten muss

Bitte in einfacher Sprache!
```

## 🔐 Authentication implementieren

```
@file .continue-context/01-PROJECT-OVERVIEW.md
@file prisma/schema.prisma
@folder backend/src

Ich möchte das Login-System fertigstellen.
Zeige mir Schritt für Schritt:
1. Wie ich Passport.js konfiguriere
2. Register-Endpoint mit den 3 Rollen (DOM/SUB/OBSERVER)
3. Login-Endpoint mit JWT
4. Genau welche Dateien wo hinkommen

Denk dran: Ich bin Anfänger, erkläre alles genau!
Dark Theme, TypeScript strict, Rollen immer prüfen!
```

## 📄 Neue Seite erstellen

```
@file .continue-context/01-PROJECT-OVERVIEW.md
@folder frontend/src/pages

Ich brauche eine [SEITENNAME]-Seite.
Die Seite soll [BESCHREIBUNG].

Erstelle mir:
1. Die komplette React-Komponente
2. Mit Dark Theme (#0a0a0a background, #dc2626 primary)
3. Mobile-first responsive
4. TypeScript types
5. Sage mir genau wo die Datei hin muss

Ich bin Anfänger!
```

## 🛡️ Protected Route erstellen

```
@file .continue-context/01-PROJECT-OVERVIEW.md
@folder frontend/src

Ich brauche eine Seite die nur [DOM/SUB/OBSERVER] sehen darf.
Zeige mir:
1. Wie ich die Route schütze
2. Wie ich die Rolle prüfe
3. Was passiert wenn jemand keine Berechtigung hat
4. Den kompletten Code

Denk dran: Dark Theme, Mobile-first!
```

## 🐛 Fehler beheben

```
@file .continue-context/01-PROJECT-OVERVIEW.md
@terminal

Ich habe diesen Fehler:
[FEHLERMELDUNG HIER EINFÜGEN]

Das passiert wenn ich:
[WAS DU GEMACHT HAST]

Erkläre mir:
1. Was das Problem ist (in einfachen Worten)
2. Wie ich es fixe (Schritt für Schritt)
3. Wie ich es in Zukunft vermeide
```

## 🎨 Component erstellen

```
@file .continue-context/01-PROJECT-OVERVIEW.md
@folder frontend/src/components

Ich brauche eine [COMPONENT-NAME] Komponente.
Sie soll [BESCHREIBUNG].

Nutze:
- React Functional Component
- TypeScript (strict!)
- Tailwind CSS (Dark Theme!)
- shadcn/ui wenn passend
- Mobile-first

Zeige mir den kompletten Code und wo er hinkommt!
```

## 📡 API Endpoint erstellen

```
@file .continue-context/01-PROJECT-OVERVIEW.md
@file prisma/schema.prisma
@folder backend/src/routes

Ich brauche einen Endpoint für [BESCHREIBUNG].
Method: [GET/POST/PUT/DELETE]
Route: /api/[route]

Der soll:
- [WAS ER MACHEN SOLL]
- Rolle checken (wer darf zugreifen?)
- Input validieren mit Zod
- Proper Error Handling

Zeige mir alle nötigen Dateien!
```

## 🗄️ Datenbank-Model hinzufügen

```
@file prisma/schema.prisma
@file .continue-context/01-PROJECT-OVERVIEW.md

Ich brauche ein Model für [WAS].
Es soll diese Felder haben:
- [FELD1]
- [FELD2]

Zeige mir:
1. Das Prisma Model
2. Die Relations zu anderen Models
3. Wie ich die Migration ausführe
4. TypeScript Types die generiert werden

In einfachen Worten bitte!
```

## 🔄 State Management

```
@file .continue-context/01-PROJECT-OVERVIEW.md
@folder frontend/src/stores

Ich brauche einen Store für [WAS].
Er soll:
- [WELCHE DATEN SPEICHERN]
- [WELCHE AKTIONEN]

Nutze Zustand und zeige mir:
1. Den kompletten Store
2. Wie ich ihn in Komponenten nutze
3. TypeScript Types
```

## 📱 Mobile Responsive machen

```
@file .continue-context/01-PROJECT-OVERVIEW.md
@file [AKTUELLE-DATEI]

Diese Komponente sieht auf dem Handy schlecht aus.
Mache sie:
- Mobile-first responsive
- Touch-friendly (min 44px tap targets)
- Tailwind Breakpoints nutzen
- Dark Theme beibehalten!
```

## 🚢 Deployment vorbereiten

```
@file .continue-context/01-PROJECT-OVERVIEW.md
@file docker-compose.yml

Ich will Underneath auf meinem NAS deployen.
Zeige mir:
1. Wie ich Production-Docker-Images baue
2. Was ich in der .env ändern muss
3. Backup-Strategie
4. Update-Prozess

Schritt für Schritt für Anfänger!
```

## 💡 Feature-Idee besprechen

```
@file .continue-context/01-PROJECT-OVERVIEW.md
@file .continue-context/03-DEVELOPMENT-PLAN.md

Ich habe die Idee für [FEATURE].
Es soll [BESCHREIBUNG].

Bewerte:
1. Passt das zum Projekt?
2. Wie aufwendig ist das?
3. Was muss ich vorher machen?
4. Wie würdest du es umsetzen?

Erkläre für Anfänger!
```

## TIPP: IMMER KONTEXT LADEN!

Bei JEDER neuen Continue-Session, lade erst den Kontext:
@file .continue-context/01-PROJECT-OVERVIEW.md
@file .continue-context/02-CURRENT-STATUS.md

Dann weiß Claude/Continue alles über dein Projekt!
EOF

echo -e "${GREEN}✓${NC} CONTINUE-PROMPTS.md erstellt"

# ========================================

# 5. TROUBLESHOOTING GUIDE

# ========================================

cat > .continue-context/05-TROUBLESHOOTING.md << 'EOF'

# TROUBLESHOOTING - HÄUFIGE PROBLEME

## Docker läuft nicht

```bash
# Status prüfen
docker compose ps

# Neu starten
docker compose down
docker compose up -d

# Logs anschauen
docker compose logs -f
```

## Port bereits belegt

```bash
# Welcher Prozess nutzt Port 5432 (Postgres)?
sudo lsof -i :5432

# System-Services stoppen
sudo systemctl stop postgresql
sudo systemctl stop redis
```

## Frontend zeigt nur weiße Seite

```bash
# Browser Console öffnen (F12)
# Fehler im Console Tab?

# Container neu bauen
docker compose down
docker compose build frontend
docker compose up -d
```

## Backend API antwortet nicht

```bash
# Health Check
curl http://localhost:3000/health

# Logs prüfen
docker compose logs backend -f

# Container neustarten
docker compose restart backend
```

## TypeScript Fehler

```bash
# Im Frontend
docker compose exec frontend npm run type-check

# Im Backend
docker compose exec backend npm run type-check
```

## Datenbank-Fehler

```bash
# Migrations ausführen
docker compose exec backend npx prisma migrate dev

# Datenbank zurücksetzen (ACHTUNG: Löscht alle Daten!)
docker compose exec backend npx prisma migrate reset
```

## Prisma Fehler

```bash
# Prisma Client neu generieren
docker compose exec backend npx prisma generate

# Schema validieren
docker compose exec backend npx prisma validate
```

## Dependencies fehlen

```bash
# Frontend
docker compose exec frontend npm install

# Backend
docker compose exec backend npm install
```

## Git Probleme

```bash
# Status prüfen
git status

# Änderungen verwerfen
git checkout .

# Auf letzten Stand bringen
git pull
```

## Continue funktioniert nicht

1. VS Code neu starten
2. Continue Extension neu laden
3. API Key prüfen in ~/.continue/config.json
4. Claude API Credits prüfen

## Speicherplatz voll

```bash
# Docker aufräumen
docker system prune -a

# Alte Images löschen
docker image prune -a

# Volumes aufräumen (VORSICHT!)
docker volume prune
```

## Performance Probleme

```bash
# Docker Stats anschauen
docker stats

# Ressourcen-Limits in docker-compose.yml setzen
```

## "Permission Denied" Fehler

```bash
# Datei-Rechte fixen
sudo chown -R $USER:$USER .

# Ausführbar machen
chmod +x scripts/*.sh
```

## Backup erstellen

```bash
# Datenbank exportieren
docker compose exec postgres pg_dump -U underneath_user underneath_db > backup.sql

# Projekt-Ordner sichern
tar -czf underneath-backup-$(date +%Y%m%d).tar.gz underneath/
```

## Bei allen anderen Problemen:

1. Exakte Fehlermeldung kopieren
2. In Continue eingeben mit:
   @file .continue-context/01-PROJECT-OVERVIEW.md
   @terminal
   "Dieser Fehler tritt auf: [FEHLER]"
   EOF

echo -e "${GREEN}✓${NC} TROUBLESHOOTING.md erstellt"

# ========================================

# 6. Quick Reference

# ========================================

cat > .continue-context/06-QUICK-REFERENCE.md << 'EOF'

# QUICK REFERENCE - WICHTIGE BEFEHLE

## Docker Befehle

```bash
# Starten
cd ~/Dokumente/Testumgebung\ Bashscript/Test_001/underneath
./scripts/dev.sh

# Status
docker compose ps

# Logs
docker compose logs -f
docker compose logs backend -f
docker compose logs frontend -f

# Stoppen
docker compose down

# Neustart
docker compose restart

# Rebuild
docker compose build
docker compose up --build
```

## Datenbank Befehle

```bash
# Prisma Studio öffnen (Datenbank GUI)
docker compose exec backend npx prisma studio

# Migration erstellen
docker compose exec backend npx prisma migrate dev --name beschreibung

# Schema pushen (ohne Migration)
docker compose exec backend npx prisma db push

# Datenbank zurücksetzen
docker compose exec backend npx prisma migrate reset
```

## Development Befehle

```bash
# TypeScript prüfen
docker compose exec frontend npm run type-check
docker compose exec backend npm run type-check

# Linting
docker compose exec frontend npm run lint
docker compose exec backend npm run lint

# Tests (wenn vorhanden)
docker compose exec frontend npm test
docker compose exec backend npm test
```

## Git Befehle

```bash
# Status
git status

# Änderungen hinzufügen
git add .

# Commit
git commit -m "feat: Beschreibung"

# Push
git push

# Pull
git pull
```

## URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Health: http://localhost:3000/health
- Adminer: http://localhost:8080
- Prisma Studio: http://localhost:5555

## Test Accounts (wenn implementiert)

- DOM: dom@underneath.local / Test123!
- SUB: sub@underneath.local / Test123!
- OBSERVER: observer@underneath.local / Test123!

## VS Code Shortcuts

- Terminal: Ctrl + `
- Continue: Ctrl + L
- Command Palette: Ctrl + Shift + P
- Datei suchen: Ctrl + P
- Suchen: Ctrl + F
- Ersetzen: Ctrl + H

## Continue Commands

- Status Check: /underneath-status
- Auth implementieren: /underneath-auth
- Fehler beheben: /underneath-fix

## Wichtige Dateien

- Projekt-Übersicht: .continue-context/01-PROJECT-OVERVIEW.md
- Aktueller Status: .continue-context/02-CURRENT-STATUS.md
- Entwicklungsplan: .continue-context/03-DEVELOPMENT-PLAN.md
- Prompts: .continue-context/04-CONTINUE-PROMPTS.md
- Schema: prisma/schema.prisma
- Docker: docker-compose.yml
- Environment: .env
  EOF

echo -e "${GREEN}✓${NC} QUICK-REFERENCE.md erstellt"

# ========================================

# Index-Datei für einfachen Zugriff

# ========================================

cat > .continue-context/README.md << 'EOF'

# 📚 UNDERNEATH - CONTINUE CONTEXT DATEIEN

Diese Dateien geben Continue/Claude vollständigen Kontext über das Projekt.

## 📖 Dateien in der richtigen Reihenfolge:

1. **[01-PROJECT-OVERVIEW.md](01-PROJECT-OVERVIEW.md)**

   - Komplette Projektübersicht
   - Tech-Stack, Rollen, Design
   - IMMER zuerst laden!

2. **[02-CURRENT-STATUS.md](02-CURRENT-STATUS.md)**

   - Was funktioniert bereits
   - Was wird gerade entwickelt
   - Bekannte Probleme

3. **[03-DEVELOPMENT-PLAN.md](03-DEVELOPMENT-PLAN.md)**

   - Schritt-für-Schritt Plan
   - 10 Phasen bis zur fertigen App
   - Prioritäten

4. **[04-CONTINUE-PROMPTS.md](04-CONTINUE-PROMPTS.md)**

   - Vorgefertigte Prompts
   - Copy & Paste ready
   - Für alle wichtigen Aufgaben

5. **[05-TROUBLESHOOTING.md](05-TROUBLESHOOTING.md)**

   - Häufige Probleme
   - Lösungen
   - Debug-Tipps

6. **[06-QUICK-REFERENCE.md](06-QUICK-REFERENCE.md)**
   - Wichtige Befehle
   - URLs
   - Shortcuts

## 🚀 So nutzt du es in Continue:

### Bei neuer Session:

```
@file .continue-context/01-PROJECT-OVERVIEW.md
@file .continue-context/02-CURRENT-STATUS.md

Ich entwickle Underneath. Was ist der aktuelle Stand?
```

### Bei spezifischen Aufgaben:

```
@file .continue-context/01-PROJECT-OVERVIEW.md
@file .continue-context/04-CONTINUE-PROMPTS.md

[Nutze einen der vorgefertigten Prompts]
```

### Bei Problemen:

```
@file .continue-context/05-TROUBLESHOOTING.md
@terminal

[Beschreibe dein Problem]
```

## 💡 Wichtige Regeln:

- IMMER den Kontext laden bevor du fragst
- IMMER erwähnen dass du Anfänger bist
- IMMER nach vollständigem Code fragen
- NIEMALS Passwörter oder API Keys committen!

## 📝 Notizen:

Aktualisiere 02-CURRENT-STATUS.md nach jeder Entwicklungs-Session!
EOF

echo -e "${GREEN}✓${NC} README.md (Index) erstellt"

# ========================================

# Abschluss

# ========================================

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ SETUP ERFOLGREICH!${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}📁 Context-Dateien erstellt in:${NC}"
echo " underneath/.continue-context/"
echo ""
echo -e "${YELLOW}📖 Folgende Dateien wurden erstellt:${NC}"
echo " 1. 01-PROJECT-OVERVIEW.md - Komplette Projektübersicht"
echo " 2. 02-CURRENT-STATUS.md - Aktueller Stand"
echo " 3. 03-DEVELOPMENT-PLAN.md - Entwicklungsplan"
echo " 4. 04-CONTINUE-PROMPTS.md - Fertige Prompts"
echo " 5. 05-TROUBLESHOOTING.md - Problemlösungen"
echo " 6. 06-QUICK-REFERENCE.md - Befehlsreferenz"
echo " 7. README.md - Index & Anleitung"
echo ""
echo -e "${YELLOW}🚀 So geht's weiter:${NC}"
echo " 1. Öffne VS Code: code ."
echo " 2. Öffne Continue: Ctrl+L"
echo " 3. Lade den Kontext:"
echo " @file .continue-context/01-PROJECT-OVERVIEW.md"
echo " @file .continue-context/02-CURRENT-STATUS.md"
echo " 4. Starte mit einem Prompt aus 04-CONTINUE-PROMPTS.md"
echo ""
echo -e "${GREEN}Viel Erfolg bei der Entwicklung von Underneath!${NC}"
echo ""

````

## 📝 **So nutzt du das Script:**

1. **Speichere es:**
```bash
nano ~/Dokumente/Testumgebung\ Bashscript/Test_001/setup-continue-context.sh
````

2. **Mache es ausführbar:**

```bash
chmod +x ~/Dokumente/Testumgebung\ Bashscript/Test_001/setup-continue-context.sh
```

3. **Führe es aus:**

```bash
cd ~/Dokumente/Testumgebung\ Bashscript/Test_001/
./setup-continue-context.sh
```

## ✨ **Was das Script macht:**

- Erstellt `.continue-context/` Ordner in deinem Projekt
- Legt 7 Dateien an mit ALLEM was Continue wissen muss
- Gibt dir fertige Prompts zum Copy-Pasten
- Erklärt Continue dass du Anfänger bist
- Dokumentiert den kompletten Entwicklungsplan

**Nach dem Ausführen hast du alles was du brauchst!** 🚀
