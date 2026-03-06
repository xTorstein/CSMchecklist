# 📱 Przewodnik: Jak udostępnić aplikację na telefonach

Aplikacja jest już skonfigurowana jako PWA (Progressive Web App), więc można ją zainstalować na telefonie jak zwykłą aplikację!

## 🎯 Najlepsze opcje dla małej grupy (kilka osób)

### Opcja 1: Darmowy hosting online (ZALECANE) ⭐

**Najlepsze dla:** Dostęp z dowolnego miejsca, łatwe udostępnianie

#### Krok 1: Wdróż aplikację na Render.com (darmowe)

**Backend:**
1. Przejdź na https://render.com i zaloguj się (można przez GitHub)
2. Kliknij **"New +"** → **"Web Service"**
3. Połącz repozytorium GitHub (lub wgraj kod)
4. Ustawienia:
   - **Name:** `csm-checklist-backend`
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
   - **Environment:** `Node`
5. Dodaj zmienne środowiskowe (Settings → Environment):
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=twoj-email@gmail.com
   SMTP_PASS=twoje-haslo-aplikacji
   ADMIN_EMAIL=twoj-email@gmail.com
   PORT=10000
   ```
6. Kliknij **"Create Web Service"**
7. ⏳ Poczekaj na wdrożenie (2-3 minuty)
8. **Zapisz URL backendu:** `https://csm-checklist-backend-xxxx.onrender.com`

**Frontend:**
1. W Render.com kliknij **"New +"** → **"Static Site"**
2. Połącz to samo repozytorium
3. Ustawienia:
   - **Name:** `csm-checklist-frontend`
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `client/build`
4. Dodaj zmienną środowiskową:
   ```
   REACT_APP_API_URL=https://csm-checklist-backend-xxxx.onrender.com
   ```
   ⚠️ Zastąp `xxxx` swoim rzeczywistym URL backendu!
5. Kliknij **"Create Static Site"**
6. ⏳ Poczekaj na wdrożenie
7. **Zapisz URL frontendu:** `https://csm-checklist-frontend-xxxx.onrender.com`

#### Krok 2: Zaktualizuj kod (jeśli potrzebne)

Jeśli frontend i backend są na różnych domenach, zaktualizuj `client/src/components/ChecklistForm.js`:

```javascript
// Znajdź linię z axios.post (około linia 85)
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

#### Krok 3: Udostępnij link użytkownikom

Wyślij im link: `https://csm-checklist-frontend-xxxx.onrender.com`

---

### Opcja 2: Lokalna sieć (dla tej samej sieci WiFi)

**Najlepsze dla:** Szybki dostęp w tej samej sieci lokalnej

#### Krok 1: Znajdź swój adres IP

**Windows:**
```powershell
ipconfig
```
Szukaj "IPv4 Address" (np. `192.168.1.100`)

**Mac/Linux:**
```bash
ifconfig
# lub
ip addr
```

#### Krok 2: Uruchom serwer z dostępem z sieci

**Backend:**
```bash
cd server
# Upewnij się że PORT=5000 w .env
node index.js
```

**Frontend:**
```bash
cd client
# Zmień proxy w package.json na:
# "proxy": "http://TWOJE-IP:5000"
npm start
```

#### Krok 3: Udostępnij link

Wyślij użytkownikom: `http://TWOJE-IP:3000`

**Uwaga:** Wszyscy muszą być w tej samej sieci WiFi!

---

### Opcja 3: Ngrok (szybkie testowanie)

**Najlepsze dla:** Szybkie testowanie z zewnątrz

1. Zainstaluj ngrok: https://ngrok.com/download
2. Uruchom serwer lokalnie:
   ```bash
   cd server
   node index.js
   ```
3. W nowym terminalu:
   ```bash
   ngrok http 5000
   ```
4. Skopiuj URL (np. `https://abc123.ngrok.io`)
5. Zaktualizuj proxy w `client/package.json`:
   ```json
   "proxy": "https://abc123.ngrok.io"
   ```
6. Uruchom frontend i udostępnij link ngrok

**Uwaga:** Darmowy ngrok generuje losowy URL przy każdym uruchomieniu.

---

## 📲 Instalacja na telefonie (po wdrożeniu)

### Android (Chrome):

1. Otwórz link aplikacji w Chrome
2. Zobaczysz baner "Dodaj do ekranu głównego" lub:
   - Menu (3 kropki) → **"Dodaj do ekranu głównego"**
3. Potwierdź nazwę i kliknij **"Dodaj"**
4. ✅ Aplikacja pojawi się jako ikona na ekranie głównym!

### iPhone/iPad (Safari):

1. Otwórz link aplikacji w Safari
2. Kliknij przycisk **"Udostępnij"** (kwadrat ze strzałką w górę)
3. Przewiń w dół i wybierz **"Dodaj do ekranu głównego"**
4. Zmień nazwę (opcjonalnie) i kliknij **"Dodaj"**
5. ✅ Aplikacja pojawi się jako ikona na ekranie głównym!

---

## ✅ Sprawdzenie czy wszystko działa

### 1. Sprawdź ikony PWA

Upewnij się, że masz ikony w `client/public/`:
- `icon-192.png` (192x192 px)
- `icon-512.png` (512x512 px)

Jeśli nie masz ikon:
- Otwórz `client/public/create-icons.html` w przeglądarce
- Pobierz wygenerowane ikony

### 2. Test lokalnie

```bash
# Terminal 1 - Backend
cd server
node index.js

# Terminal 2 - Frontend  
cd client
npm start
```

Otwórz http://localhost:3000 i sprawdź:
- Czy aplikacja się ładuje
- Czy można wysłać checklistę
- Czy email przychodzi

### 3. Test na telefonie

1. Upewnij się, że telefon jest w tej samej sieci (lokalnie) lub ma dostęp do internetu (hosting)
2. Otwórz link aplikacji na telefonie
3. Sprawdź czy działa instalacja PWA
4. Wyślij testową checklistę

---

## 🔒 Bezpieczeństwo dla małej grupy

### Jeśli używasz hostingu online:

1. **Ogranicz dostęp (opcjonalnie):**
   - Możesz dodać prostą autoryzację w kodzie
   - Lub użyć Render.com "Private" (płatne)

2. **HTTPS jest wymagany dla PWA:**
   - Render.com automatycznie zapewnia HTTPS ✅
   - Ngrok darmowy też ma HTTPS ✅
   - Lokalna sieć: użyj HTTPS przez ngrok lub certyfikat

### Jeśli używasz sieci lokalnej:

- Tylko osoby w tej samej sieci WiFi mogą uzyskać dostęp
- Upewnij się, że serwer działa podczas korzystania

---

## 🆘 Rozwiązywanie problemów

### Aplikacja nie instaluje się na telefonie:

1. **Sprawdź HTTPS:** PWA wymaga HTTPS (lub localhost)
2. **Sprawdź manifest.json:** Otwórz DevTools → Application → Manifest
3. **Sprawdź ikony:** Muszą być w `client/public/`
4. **Sprawdź service worker:** DevTools → Application → Service Workers

### Email nie przychodzi:

1. Sprawdź logi serwera
2. Sprawdź folder SPAM
3. Zweryfikuj konfigurację SMTP w `.env`
4. Uruchom test: `cd server && node test-email.js`

### Backend nie odpowiada:

1. Sprawdź czy serwer działa: `http://localhost:5000/api/health`
2. Sprawdź logi serwera
3. Sprawdź zmienne środowiskowe
4. Sprawdź czy port nie jest zajęty

---

## 📝 Podsumowanie - Najszybsza ścieżka

1. **Wdróż na Render.com** (15 minut)
   - Backend: Web Service
   - Frontend: Static Site
   - Dodaj zmienne środowiskowe

2. **Udostępnij link** użytkownikom

3. **Instrukcja dla użytkowników:**
   - Otwórz link w Chrome (Android) lub Safari (iOS)
   - Dodaj do ekranu głównego
   - Gotowe! ✅

---

## 💡 Dodatkowe wskazówki

- **Darmowy hosting Render.com** ma limit: aplikacja "śpi" po 15 minutach bezczynności (budzi się przy pierwszym żądaniu)
- **Dla większej grupy:** Rozważ płatny plan lub inne rozwiązanie
- **Backup:** Regularnie eksportuj dane z bazy SQLite
- **Aktualizacje:** Po zmianach w kodzie, push do GitHub automatycznie przebuduje aplikację na Render.com

---

**Gotowe!** Twoja aplikacja jest teraz dostępna na telefonach! 📱✨
