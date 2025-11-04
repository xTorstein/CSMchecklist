# 📘 Przewodnik krok po kroku: Render.com + GitHub

## 🎯 Szybki start - 5 kroków

### 1️⃣ Utwórz repozytorium GitHub

```bash
# Jeśli nie masz jeszcze repozytorium
cd "C:\Users\wikto\Desktop\Checklista dla wykładowcow"

# Inicjalizuj git (jeśli jeszcze nie)
git init

# Dodaj wszystkie pliki
git add .

# Zrób pierwszy commit
git commit -m "Initial commit - CSM Checklist PWA"

# Utwórz repozytorium na GitHub.com
# Następnie połącz:
git remote add origin https://github.com/TWOJA-NAZWA/csm-checklist.git
git branch -M main
git push -u origin main
```

### 2️⃣ Zaloguj się do Render.com

1. Przejdź na https://render.com
2. Kliknij **"Get Started for Free"**
3. Wybierz **"Sign in with GitHub"**
4. Autoryzuj dostęp do GitHub

### 3️⃣ Wdróż Backend

1. Kliknij **"New +"** (prawy górny róg)
2. Wybierz **"Web Service"**
3. Kliknij **"Connect GitHub"** (jeśli pierwszy raz)
4. Wybierz repozytorium `csm-checklist`
5. Kliknij **"Connect"**

**Wypełnij formularz:**
- **Name:** `csm-checklist-backend`
- **Region:** `Frankfurt` (lub najbliższy)
- **Branch:** `main`
- **Root Directory:** `server` ⚠️ **WAŻNE!**
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `node index.js`
- **Plan:** `Free`

**Dodaj zmienne środowiskowe:**
Kliknij **"Advanced"** → **"Add Environment Variable"** i dodaj:

```
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = czopekwiktor1@gmail.com
SMTP_PASS = kjos wvsy lijz xjoe
ADMIN_EMAIL = czopekwiktor1@gmail.com
```

6. Kliknij **"Create Web Service"**
7. ⏳ Poczekaj na wdrożenie (2-3 minuty)
8. **Zapisz URL:** `https://csm-checklist-backend-xxxx.onrender.com`

### 4️⃣ Wdróż Frontend

1. Kliknij **"New +"** → **"Static Site"**
2. Wybierz to samo repozytorium
3. Kliknij **"Connect"**

**Wypełnij formularz:**
- **Name:** `csm-checklist-frontend`
- **Branch:** `main`
- **Root Directory:** zostaw **puste**
- **Build Command:** `cd client && npm install && npm run build`
- **Publish Directory:** `client/build`

**Dodaj zmienne środowiskowe (opcjonalnie):**
Jeśli chcesz użyć zmiennej dla API URL:
```
REACT_APP_API_URL = https://csm-checklist-backend-xxxx.onrender.com
```
⚠️ Zastąp `xxxx` swoim rzeczywistym URL!

4. Kliknij **"Create Static Site"**
5. ⏳ Poczekaj na wdrożenie (2-3 minuty)
6. **Zapisz URL:** `https://csm-checklist-frontend-xxxx.onrender.com`

### 5️⃣ Zaktualizuj konfigurację API (jeśli potrzebne)

Jeśli frontend i backend są na różnych domenach, zaktualizuj `client/src/components/ChecklistForm.js`:

```javascript
// Znajdź linię z axios.post
const response = await axios.post('/api/checklist/create', {

// Zmień na:
const apiUrl = process.env.REACT_APP_API_URL || '';
const response = await axios.post(`${apiUrl}/api/checklist/create`, {
```

Następnie:
```bash
git add .
git commit -m "Update API URL for production"
git push
```

Render automatycznie przebuduje aplikację!

## ✅ Gotowe!

Twoja aplikacja jest teraz dostępna online 24/7:
- **Frontend:** `https://csm-checklist-frontend-xxxx.onrender.com`
- **Backend:** `https://csm-checklist-backend-xxxx.onrender.com`

## 📱 Instalacja na telefonie

1. Otwórz URL frontendu na telefonie
2. **Android:** Menu Chrome → "Dodaj do ekranu głównego"
3. **iOS:** Safari → Udostępnij → "Dodaj do ekranu głównego"

## 🔧 Rozwiązywanie problemów

### Backend nie działa:
- Sprawdź czy Root Directory = `server`
- Sprawdź czy wszystkie zmienne środowiskowe są dodane
- Sprawdź logi w Render Dashboard → "Logs"

### Frontend nie łączy się z backendem:
- Sprawdź czy zmienna `REACT_APP_API_URL` jest ustawiona
- Sprawdź czy URL backendu jest poprawny
- Sprawdź CORS w `server/index.js` (powinno być `app.use(cors())`)

### Aplikacja nie instaluje się na telefonie:
- Sprawdź czy ikony PWA są w `client/public/`:
  - `icon-192.png`
  - `icon-512.png`
- Użyj generatora: otwórz `client/public/create-icons.html` w przeglądarce

## 💡 Wskazówki

- Render Free plan ma limit czasu bezczynności (15 min), więc pierwsze żądanie może być wolniejsze
- Możesz użyć usługi typu UptimeRobot (darmowa) do "pingowania" backendu co 5 minut, aby był zawsze aktywny
- Wszystkie zmiany w GitHub automatycznie przebudują aplikację na Render

