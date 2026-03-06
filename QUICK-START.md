# 🚀 Szybki start - Udostępnienie aplikacji na telefonach

## Najszybsza metoda (15 minut) ⚡

### 1. Wdróż na Render.com (darmowe)

**Backend:**
- Przejdź na https://render.com
- "New +" → "Web Service"
- Root Directory: `server`
- Start Command: `node index.js`
- Dodaj zmienne środowiskowe z `server/.env`
- Zapisz URL backendu

**Frontend:**
- "New +" → "Static Site"  
- Root Directory: `client`
- Build Command: `npm install && npm run build`
- Publish Directory: `client/build`
- Dodaj: `REACT_APP_API_URL=https://twoj-backend-url.onrender.com`
- Zapisz URL frontendu

### 2. Udostępnij link

Wyślij użytkownikom link do frontendu.

### 3. Instalacja na telefonie

**Android:** Chrome → Menu → "Dodaj do ekranu głównego"  
**iPhone:** Safari → Udostępnij → "Dodaj do ekranu głównego"

---

## Alternatywa: Sieć lokalna

Jeśli wszyscy są w tej samej sieci WiFi:

1. Znajdź swój IP: `ipconfig` (Windows) lub `ifconfig` (Mac/Linux)
2. Uruchom serwer: `cd server && node index.js`
3. Uruchom frontend: `cd client && npm start`
4. Udostępnij: `http://TWOJE-IP:3000`

---

📖 **Szczegółowy przewodnik:** Zobacz `INSTALACJA-MOBILNA.md`
