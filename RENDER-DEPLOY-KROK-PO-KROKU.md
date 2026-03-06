# 🚀 Wdrożenie na Render.com - Krok po kroku

## ✅ Co już jest gotowe:
- ✅ Kod jest na GitHub: https://github.com/xTorstein/CSMchecklist
- ✅ Frontend obsługuje zmienną `REACT_APP_API_URL`
- ✅ Backend ma CORS skonfigurowany
- ✅ Wszystkie pliki są gotowe

---

## 📋 KROK 1: Zaloguj się do Render.com

1. Przejdź na: **https://render.com**
2. Kliknij **"Get Started for Free"** lub **"Sign In"**
3. Wybierz **"Sign in with GitHub"**
4. Autoryzuj dostęp do GitHub
5. ✅ Jesteś zalogowany!

---

## 🔧 KROK 2: Wdróż Backend (Web Service)

### 2.1. Utwórz nowy Web Service

1. W Render Dashboard kliknij **"New +"** (prawy górny róg)
2. Wybierz **"Web Service"**

### 2.2. Połącz repozytorium GitHub

1. Jeśli pierwszy raz:
   - Kliknij **"Connect GitHub"**
   - Autoryzuj dostęp do repozytoriów
   - Wybierz **"All repositories"** lub tylko **"xTorstein/CSMchecklist"**
   - Kliknij **"Connect"**

2. Wybierz repozytorium: **`xTorstein/CSMchecklist`**
3. Kliknij **"Connect"**

### 2.3. Wypełnij formularz konfiguracji

**Podstawowe ustawienia:**
- **Name:** `csm-checklist-backend`
- **Region:** `Frankfurt` (lub najbliższy Tobie)
- **Branch:** `main`
- **Root Directory:** `server` ⚠️ **WAŻNE - musi być `server`!**
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `node index.js`
- **Plan:** `Free`

### 2.4. Dodaj zmienne środowiskowe

1. Kliknij **"Advanced"** (na dole formularza)
2. W sekcji **"Environment Variables"** kliknij **"Add Environment Variable"**
3. Dodaj każdą zmienną osobno:

```
Key: SMTP_HOST
Value: smtp.gmail.com
```

```
Key: SMTP_PORT
Value: 587
```

```
Key: SMTP_USER
Value: twoj-email@gmail.com
```

```
Key: SMTP_PASS
Value: twoje-haslo-aplikacji (Gmail: hasło aplikacji)
```

```
Key: ADMIN_EMAIL
Value: email-odbiorcy@gmail.com
```

```
Key: PORT
Value: 10000
```

⚠️ **UWAGA:** Render automatycznie ustawia PORT, ale dodajemy go na wszelki wypadek.

### 2.5. Utwórz Web Service

1. Kliknij **"Create Web Service"**
2. ⏳ Poczekaj na wdrożenie (2-5 minut)
3. Zobaczysz logi w czasie rzeczywistym
4. Gdy zobaczysz **"Your service is live"** - backend jest gotowy!

### 2.6. Zapisz URL backendu

1. Po wdrożeniu, w górnej części strony Render zobaczysz **prawdziwy URL** backendu
2. **Przykład jak wygląda prawdziwy URL:**
   - Render wygeneruje coś takiego: `https://csm-checklist-backend-abc123.onrender.com`
   - Albo: `https://csm-checklist-backend-xyz789.onrender.com`
   - **Każdy URL jest unikalny!** Render automatycznie dodaje losowe znaki
3. **Gdzie znaleźć URL:**
   - W Render Dashboard → kliknij na `csm-checklist-backend`
   - Na górze strony zobaczysz: **"Your service is live at:"**
   - To jest Twój prawdziwy URL - **skopiuj go!**
4. **Zapisz ten URL** - będziesz go potrzebować w kroku 3.4!
5. Przetestuj czy działa: Otwórz URL + `/api/health` w przeglądarce
   - Przykład: `https://csm-checklist-backend-abc123.onrender.com/api/health`
   - Powinieneś zobaczyć: `{"status":"OK","message":"Server is running"}`

---

## 🎨 KROK 3: Wdróż Frontend (Static Site)

### 3.1. Utwórz nowy Static Site

1. W Render Dashboard kliknij **"New +"**
2. Wybierz **"Static Site"**

### 3.2. Połącz repozytorium

1. Wybierz repozytorium: **`xTorstein/CSMchecklist`**
2. Kliknij **"Connect"**

### 3.3. Wypełnij formularz konfiguracji

**Podstawowe ustawienia:**
- **Name:** `csm-checklist-frontend`
- **Region:** `Frankfurt` (lub ten sam co backend)
- **Branch:** `main`
- **Root Directory:** zostaw **PUSTE** (nie wpisuj nic!)
- **Build Command:** `cd client && npm install && npm run build`
- **Publish Directory:** `client/build`
- **Plan:** `Free`

### 3.4. Dodaj zmienną środowiskową

1. Kliknij **"Advanced"**
2. W sekcji **"Environment Variables"** kliknij **"Add Environment Variable"**
3. Dodaj zmienną z **prawdziwym URL backendu** z kroku 2.6:

```
Key: REACT_APP_API_URL
Value: [TUTAJ WKLEJ PRAWDZIWY URL Z KROKU 2.6]
```

⚠️ **WAŻNE:** 
- **NIE używaj** `xxxx` - to był tylko przykład!
- **Użyj prawdziwego URL** który Render wygenerował w kroku 2.6
- **Skopiuj dokładnie** URL z Render Dashboard (bez `/api` na końcu!)

**Przykład jak powinno wyglądać:**

Jeśli w kroku 2.6 Render wygenerował URL: `https://csm-checklist-backend-abc123.onrender.com`

To w tym kroku wpisz:
```
Key: REACT_APP_API_URL
Value: https://csm-checklist-backend-abc123.onrender.com
```

**Inny przykład:**
Jeśli Render wygenerował: `https://csm-checklist-backend-xyz789.onrender.com`

To wpisz:
```
Key: REACT_APP_API_URL
Value: https://csm-checklist-backend-xyz789.onrender.com
```

**Gdzie znaleźć prawdziwy URL:**
- Render Dashboard → kliknij na `csm-checklist-backend`
- Na górze strony: **"Your service is live at:"** → to jest Twój URL!

### 3.5. Utwórz Static Site

1. Kliknij **"Create Static Site"**
2. ⏳ Poczekaj na wdrożenie (2-5 minut)
3. Zobaczysz logi budowania
4. Gdy zobaczysz **"Your site is live"** - frontend jest gotowy!

### 3.6. Zapisz URL frontendu

1. W górnej części strony zobaczysz URL: `https://csm-checklist-frontend-xxxx.onrender.com`
2. **Zapisz ten URL** - to jest link do Twojej aplikacji!

---

## ✅ KROK 4: Sprawdź czy wszystko działa

### 4.1. Przetestuj aplikację

1. Otwórz URL frontendu w przeglądarce
2. Powinieneś zobaczyć formularz checklisty
3. Wypełnij testową checklistę i wyślij
4. Sprawdź czy email przychodzi

### 4.2. Sprawdź logi (jeśli coś nie działa)

**Backend:**
1. W Render Dashboard kliknij na `csm-checklist-backend`
2. Przejdź do zakładki **"Logs"**
3. Sprawdź czy są błędy

**Frontend:**
1. W Render Dashboard kliknij na `csm-checklist-frontend`
2. Przejdź do zakładki **"Logs"**
3. Sprawdź czy build się powiódł

---

## 🔄 KROK 5: Automatyczne wdrożenia

Render automatycznie wykrywa zmiany na GitHub!

**Jak to działa:**
1. Wprowadzasz zmiany w kodzie
2. Pushujesz na GitHub: `git push origin main`
3. Render automatycznie wykrywa zmiany
4. Automatycznie przebudowuje i wdraża aplikację
5. ⏳ Poczekaj 2-5 minut
6. ✅ Aplikacja jest zaktualizowana!

**Możesz też ręcznie wdrożyć:**
- W Render Dashboard → wybierz serwis → **"Manual Deploy"** → **"Deploy latest commit"**

---

## 🆘 Rozwiązywanie problemów

### Problem: Backend nie startuje

**Sprawdź:**
1. Czy Root Directory = `server` (nie `./server` ani puste!)
2. Czy wszystkie zmienne środowiskowe są dodane
3. Czy Start Command = `node index.js`
4. Sprawdź logi w Render Dashboard

**Częste błędy:**
- `Error: Cannot find module` → Sprawdź czy Root Directory jest poprawne
- `Port already in use` → Render automatycznie ustawia PORT, usuń PORT z zmiennych środowiskowych
- `SMTP error` → Sprawdź czy SMTP_PASS jest poprawne (hasło aplikacji Gmail)

### Problem: Frontend nie łączy się z backendem

**Sprawdź:**
1. Czy zmienna `REACT_APP_API_URL` jest ustawiona
2. Czy URL backendu jest poprawny (bez `/api` na końcu!)
3. Czy backend działa (otwórz `/api/health` w przeglądarce)
4. Sprawdź logi frontendu - czy build się powiódł

**Rozwiązanie:**
- Upewnij się że `REACT_APP_API_URL` ma pełny URL: `https://csm-checklist-backend-xxxx.onrender.com`
- Nie dodawaj `/api` na końcu!

### Problem: Email nie przychodzi

**Sprawdź:**
1. Logi backendu w Render Dashboard
2. Czy SMTP_PASS to hasło aplikacji Gmail (nie zwykłe hasło!)
3. Sprawdź folder SPAM
4. Uruchom test: W Render Dashboard → Backend → Shell → `node test-email.js`

### Problem: Aplikacja "śpi" (wolne pierwsze żądanie)

**To normalne na darmowym planie Render:**
- Aplikacja "śpi" po 15 minutach bezczynności
- Pierwsze żądanie po "śnie" może zająć 30-60 sekund
- To jest limit darmowego planu

**Rozwiązanie (opcjonalne):**
- Użyj UptimeRobot (darmowe): https://uptimerobot.com
- Ustaw ping do backendu co 5 minut
- Aplikacja będzie zawsze aktywna

---

## 📱 Instalacja na telefonie

Po wdrożeniu:

1. Otwórz URL frontendu na telefonie
2. **Android:** Chrome → Menu (3 kropki) → **"Dodaj do ekranu głównego"**
3. **iPhone:** Safari → Udostępnij (kwadrat ze strzałką) → **"Dodaj do ekranu głównego"**
4. ✅ Aplikacja pojawi się jako ikona!

---

## 📊 Podsumowanie - Twoje URL-e

Po wdrożeniu będziesz mieć:

- **Backend:** `https://csm-checklist-backend-xxxx.onrender.com`
- **Frontend:** `https://csm-checklist-frontend-xxxx.onrender.com`

**Udostępnij użytkownikom tylko URL frontendu!**

---

## ✅ Checklist wdrożenia

- [ ] Zalogowany na Render.com przez GitHub
- [ ] Backend Web Service utworzony
- [ ] Root Directory = `server`
- [ ] Wszystkie zmienne środowiskowe dodane (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ADMIN_EMAIL, PORT)
- [ ] Backend działa (sprawdzony `/api/health`)
- [ ] URL backendu zapisany
- [ ] Frontend Static Site utworzony
- [ ] Root Directory puste (dla frontendu)
- [ ] Build Command = `cd client && npm install && npm run build`
- [ ] Publish Directory = `client/build`
- [ ] Zmienna `REACT_APP_API_URL` dodana z URL backendu
- [ ] Frontend działa
- [ ] Testowa checklista wysłana i email przyszedł
- [ ] Aplikacja zainstalowana na telefonie

---

**Gotowe!** 🎉 Twoja aplikacja jest teraz dostępna online 24/7!
