# ⚡ Render.com - Szybki start

## 🎯 W 3 krokach

### 1️⃣ Backend (Web Service)

```
Render Dashboard → "New +" → "Web Service"
├── Connect: xTorstein/CSMchecklist
├── Name: csm-checklist-backend
├── Root Directory: server ⚠️
├── Build Command: npm install
├── Start Command: node index.js
└── Environment Variables:
    ├── SMTP_HOST = smtp.gmail.com
    ├── SMTP_PORT = 587
    ├── SMTP_USER = twoj-email@gmail.com
    ├── SMTP_PASS = twoje-haslo-aplikacji (Gmail: hasło aplikacji)
    ├── ADMIN_EMAIL = email-odbiorcy@gmail.com
    └── PORT = 10000
```

**Zapisz URL:** Render wygeneruje unikalny URL, np.:
`https://csm-checklist-backend-abc123.onrender.com`
(każdy URL jest inny - Render dodaje losowe znaki)

---

### 2️⃣ Frontend (Static Site)

```
Render Dashboard → "New +" → "Static Site"
├── Connect: xTorstein/CSMchecklist
├── Name: csm-checklist-frontend
├── Root Directory: (PUSTE!)
├── Build Command: cd client && npm install && npm run build
├── Publish Directory: client/build
└── Environment Variables:
    └── REACT_APP_API_URL = [WKLEJ TUTAJ PRAWDZIWY URL BACKENDU Z KROKU 1]
```

**Zapisz URL:** Render wygeneruje unikalny URL frontendu, np.:
`https://csm-checklist-frontend-xyz789.onrender.com`

---

### 3️⃣ Test

1. Otwórz URL frontendu
2. Wyślij testową checklistę
3. Sprawdź email
4. ✅ Gotowe!

---

📖 **Szczegółowy przewodnik:** Zobacz `RENDER-DEPLOY-KROK-PO-KROKU.md`
