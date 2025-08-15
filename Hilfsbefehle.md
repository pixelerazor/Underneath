Github:

# Gehe in dein Projekt

cd ~/Dokumente/Underneath_app/underneath

# Füge GitHub als Remote hinzu

git remote add origin git@github.com:pixelerazor/Underneath.git

# Benenne den Branch zu main um (GitHub Standard)

git branch -M main

# Schaue was sich geändert hat

git status

# Füge alle Änderungen hinzu (falls welche da sind)

git add .

# Committe die Änderungen

git commit -m "Add new project"

# Push zum ersten Mal zu GitHub

git push -u origin main

Docker:

# Zeige alle laufenden Container

docker ps

# Zeige ALLE Container (auch gestoppte)

docker ps -a

# Speziell für dein Projekt - zeige Underneath Container

docker compose ps

# Detaillierter Status mit Ressourcenverbrauch

docker stats --no-stream

# Prüfe ob Docker Daemon läuft

docker version

Empfohlene VS Code Extensions:

# Alle auf einmal installieren

code --install-extension ms-azuretools.vscode-docker \
 --install-extension dbaeumer.vscode-eslint \
 --install-extension esbenp.prettier-vscode \
 --install-extension prisma.prisma \
 --install-extension bradlc.vscode-tailwindcss \
 --install-extension formulahendry.auto-rename-tag \
 --install-extension naumovs.color-highlight \
 --install-extension usernamehw.errorlens \
 --install-extension dsznajder.es7-react-js-snippets

7. Continue optimal nutzen:
   Projekt-Context laden:

Öffne Continue Sidebar (Icon rechts)
Klicke auf @codebase
Continue indexiert dein Projekt

# In Continue Chat:

@code # Referenziert ausgewählten Code
@file # Referenziert aktuelle Datei
@folder # Referenziert Ordner
@codebase # Durchsucht gesamtes Projekt
@terminal # Bezieht Terminal-Output ein
@problems # Zeigt VS Code Probleme

# Slash Commands:

/edit # Editiert selektierten Code
/comment # Fügt Kommentare hinzu
/underneath-component # Dein custom command
/prisma-model # Dein custom command

8. Beispiel Workflow:

Neue Komponente erstellen:

Selektiere Code oder öffne neue Datei
Continue: /underneath-component Create a user profile card

API Endpoint generieren:

Öffne backend/src/routes/
Continue: /api-endpoint Create CRUD endpoints for Task model

Debugging:

Kopiere Fehlermeldung
Continue: @terminal @problems Help me fix this error

Code Review:

Selektiere Code
Continue: @code Review this for security issues and performance

9. Pro-Tipps:

Kosten sparen:

Nutze Haiku für einfache Aufgaben
Sonnet nur für komplexe Probleme
Lokale Modelle für Autocomplete

Context begrenzen:

Nicht immer @codebase verwenden
Spezifische Files/Folders referenzieren

Templates nutzen:

Custom Commands für wiederkehrende Patterns
Speichere gute Prompts
