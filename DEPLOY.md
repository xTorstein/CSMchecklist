# Instrukcja wdrożenia aplikacji CSM Checklist

## Opcje hostingu (aplikacja będzie dostępna 24/7)

### Opcja 1: Vercel (Zalecane - darmowe, łatwe)

1. **Zainstaluj Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Zaloguj się:**
   ```bash
   vercel login
   ```

3. **Wdróż aplikację:**
   ```bash
   # W głównym katalogu projektu
   vercel
   ```

4. **Konfiguracja backendu:**
   - Vercel automatycznie wykryje frontend React
   - Backend możesz hostować na Render.com (darmowe)

### Opcja 2: Render.com (Darmowe dla frontend i backend)

#### Krok 1: Przygotowanie repozytorium GitHub

1. **Utwórz repozytorium na GitHub:**
   - Przejdź na https://github.com
   - Kliknij "+" → "New repository"
   - Nadaj nazwę (np. `csm-checklist`)
   - Wybierz "Public" (darmowe na Render) lub "Private" (wymaga płatnego planu)
   - **NIE** zaznaczaj "Initialize with README" (jeśli masz już pliki)
   - Kliknij "Create repository"

2. **Wgraj kod do GitHub:**
   ```bash
   # W terminalu, w głównym katalogu projektu
   git init
   git add .
   git commit -m "Initial commit - CSM Checklist"
   git branch -M main
   git remote add origin https://github.com/TWOJA-NAZWA/csm-checklist.git
   git push -u origin main
   ```
   
   ⚠️ **Zastąp `TWOJA-NAZWA`** swoją nazwą użytkownika GitHub!

#### Krok 2: Połączenie z Render.com

1. **Utwórz konto na Render:**
   - Przejdź na https://render.com
   - Kliknij "Get Started for Free"
   - Wybierz "Sign in with GitHub"
   - Zaloguj się i autoryzuj dostęp do GitHub

2. **Wdróż Backend (Web Service):**
   
   a. Kliknij **"New +"** w prawym górnym rogu → wybierz **"Web Service"**
   
   b. **Połącz repozytorium:**
      - Kliknij **"Connect GitHub"** jeśli jeszcze nie połączone
      - Wybierz swoje repozytorium z listy
      - Kliknij **"Connect"**
   
   c. **Konfiguracja:**
      - **Name:** `csm-checklist-backend` (lub dowolna nazwa)
      - **Region:** wybierz najbliższy (np. Frankfurt)
      - **Branch:** `main` (lub `master`)
      - **Root Directory:** zostaw puste (lub wpisz `server` jeśli Render nie wykrywa automatycznie)
      - **Runtime:** `Node`
      - **Build Command:** `cd server && npm install`
      - **Start Command:** `cd server && node index.js`
   
   d. **Zmienne środowiskowe:**
      - Kliknij **"Advanced"** → **"Add Environment Variable"**
      - Dodaj wszystkie zmienne z pliku `.env`:
        ```
        SMTP_HOST = smtp.gmail.com
        SMTP_PORT = 587
        SMTP_USER = twoj-email@gmail.com
        SMTP_PASS = twoje-haslo-aplikacji
        ADMIN_EMAIL = twoj-email@gmail.com
        PORT = 10000
        ```
      - ⚠️ Render automatycznie przypisuje port, więc możesz użyć `PORT = 10000` lub zostawić puste
   
   e. **Plan:** Wybierz **"Free"** (darmowy)
   
   f. Kliknij **"Create Web Service"**
   
   g. **Zapisz URL backendu:**
      - Po wdrożeniu Render pokaże URL (np. `https://csm-checklist-backend.onrender.com`)
      - ⚠️ **Zapisz ten URL!** Będziesz go potrzebować dla frontendu

3. **Wdróż Frontend (Static Site):**
   
   a. Kliknij **"New +"** → wybierz **"Static Site"**
   
   b. **Połącz repozytorium:**
      - Wybierz to samo repozytorium GitHub
      - Kliknij **"Connect"**
   
   c. **Konfiguracja:**
      - **Name:** `csm-checklist-frontend`
      - **Branch:** `main` (lub `master`)
      - **Root Directory:** zostaw puste
      - **Build Command:** `cd client && npm install && npm run build`
      - **Publish Directory:** `client/build`
   
   d. **Zmienne środowiskowe (opcjonalnie):**
      - Jeśli chcesz użyć zmiennej dla URL API, dodaj:
        ```
        REACT_APP_API_URL = https://csm-checklist-backend.onrender.com
        ```
      - ⚠️ Zastąp URL swoim rzeczywistym URL backendu z kroku 2g!
   
   e. Kliknij **"Create Static Site"**

#### Krok 3: Aktualizacja konfiguracji frontendu

Jeśli backend jest na innym URL niż frontend, musisz zaktualizować konfigurację:

1. **Utwórz plik `client/.env.production`:**
   ```
   REACT_APP_API_URL=https://csm-checklist-backend.onrender.com
   ```
   ⚠️ Zastąp URL swoim rzeczywistym URL backendu!

2. **Zaktualizuj `client/src/components/ChecklistForm.js`:**
   Zmień linię z axios.post na:
   ```javascript
   const apiUrl = process.env.REACT_APP_API_URL || '';
   const response = await axios.post(`${apiUrl}/api/checklist/create`, {
   ```

3. **Commit i push:**
   ```bash
   git add .
   git commit -m "Update API URL for production"
   git push
   ```
   Render automatycznie przebuduje aplikację!

#### Krok 4: Instalacja na telefonie

Po wdrożeniu:
1. Otwórz URL frontendu na telefonie (np. `https://csm-checklist-frontend.onrender.com`)
2. Zainstaluj jako PWA (instrukcje w README.md)
3. Aplikacja będzie dostępna 24/7!

### Opcja 3: Netlify (Darmowe dla frontend)

1. **Frontend:**
   - Przejdź na https://netlify.com
   - Zaloguj się
   - Drag & drop folder `client/build` po zbudowaniu
   - Lub połącz przez GitHub

2. **Backend:**
   - Użyj Render.com lub Heroku dla backendu

## Instalacja jako aplikacja mobilna (PWA)

### Na Androidzie:

1. Otwórz aplikację w przeglądarce Chrome
2. Zobaczysz powiadomienie "Dodaj do ekranu głównego"
3. Kliknij "Dodaj"
4. Aplikacja pojawi się jako ikona na ekranie głównym

### Na iOS (iPhone/iPad):

1. Otwórz aplikację w przeglądarce Safari
2. Kliknij przycisk "Udostępnij" (kwadrat ze strzałką)
3. Wybierz "Dodaj do ekranu głównego"
4. Zatwierdź nazwę i kliknij "Dodaj"

### Link do instalacji:

Po wdrożeniu, użytkownicy mogą:
- Otworzyć link w przeglądarce mobilnej
- Zobaczyć opcję "Zainstaluj aplikację" w przeglądarce
- Kliknąć i zainstalować

## Konfiguracja przed wdrożeniem

### 1. Utwórz ikony PWA:

Uruchom `client/public/create-icons.html` w przeglądarce, aby wygenerować ikony:
- `icon-192.png`
- `icon-512.png`

Lub użyj własnych ikon o wymiarach 192x192 i 512x512 px.

### 2. Zaktualizuj zmienne środowiskowe:

W serwisie hostingowym (Render, Vercel, etc.) dodaj:
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `ADMIN_EMAIL`
- `PORT`

### 3. Zaktualizuj URL API w frontend:

Jeśli backend jest na innym serwerze, zaktualizuj `client/package.json`:
```json
"proxy": "https://twoj-backend-url.com"
```

Lub użyj zmiennej środowiskowej `REACT_APP_API_URL` w frontend.

## Testowanie lokalnie przed wdrożeniem

```bash
# Zbuduj frontend
cd client
npm run build

# Uruchom backend
cd ../server
node index.js
```

## Wymagania techniczne

- Node.js 14+ 
- npm lub yarn
- Konto email z dostępem SMTP (Gmail, Outlook, etc.)

## Bezpieczeństwo

⚠️ **Ważne:** Nigdy nie commituj pliku `.env` do repozytorium!

Plik `.env` jest już w `.gitignore`, ale zawsze sprawdź przed commitem.

## Pomoc

W razie problemów:
1. Sprawdź logi w konsoli serwera
2. Sprawdź Network tab w DevTools przeglądarki
3. Upewnij się, że wszystkie zmienne środowiskowe są ustawione

