# Konfiguracja email na Renderze (backend)

Aby lista z formularza była wysyłana na maila, w **Web Service** (backend) na Renderze muszą być ustawione zmienne środowiskowe SMTP.

## Kroki

1. Wejdź na [Render Dashboard](https://dashboard.render.com).
2. Otwórz **Web Service** z backendem (np. `csmchecklist-backend`).
3. W lewym menu wybierz **Environment**.
4. Dodaj zmienne (każda osobno; **Key** i **Value**):

   | Key         | Value (przykład)        | Opis |
   |------------|--------------------------|------|
   | `SMTP_HOST` | `smtp.gmail.com`        | Serwer SMTP (dla Gmaila: smtp.gmail.com) |
   | `SMTP_PORT` | `587`                   | Port (587 dla TLS) |
   | `SMTP_USER` | `twoj-email@gmail.com`  | Adres email do logowania SMTP |
   | `SMTP_PASS` | `hasło-aplikacji`       | Hasło aplikacji (Gmail: hasło aplikacji, nie zwykłe hasło) |
   | `ADMIN_EMAIL` | `twoj-email@gmail.com` | Adres, na który mają przychodzić powiadomienia (checklisty) |

5. Kliknij **Save Changes**. Render zrestartuje usługę.

### Gmail – hasło aplikacji (obowiązkowe)

- **Nie używaj zwykłego hasła do konta** – Gmail blokuje logowanie z zewnętrznych aplikacji.
- Wejdź w konto Google → [Bezpieczeństwo](https://myaccount.google.com/security) → **Weryfikacja dwuetapowa** (musi być włączona) → **Hasła aplikacji**.
- Wygeneruj hasło aplikacji (np. „CSM Checklist”) i wklej je w zmienną **SMTP_PASS** na Renderze.
- W `SMTP_USER` podaj pełny adres Gmaila (np. `twoj.email@gmail.com`).

### Jeśli port 587 nie działa (timeout / ECONNREFUSED)

- Na Renderze ustaw **SMTP_PORT** = **465** (SSL). Reszta zmiennych bez zmian.

## Sprawdzenie

1. **Czy zmienne są widoczne**  
   Otwórz: `https://TWOJ-BACKEND.onrender.com/api/health`  
   W odpowiedzi powinno być: `"emailConfigured": true`.  
   Jeśli jest `false`, którejś zmiennej (SMTP_USER, SMTP_PASS, ADMIN_EMAIL) brakuje w Environment backendu.

2. **Test wysyłki (diagnostyka)**  
   Otwórz w przeglądarce: `https://TWOJ-BACKEND.onrender.com/api/email-test`  
   - Odpowiedź `{"ok":true,"message":"Test email sent to ..."}` – sprawdź skrzynkę (też SPAM).  
   - Odpowiedź `{"ok":false,"error":"..."}` – w `error` jest przyczyna (np. błąd logowania EAUTH = użyj hasła aplikacji; timeout = spróbuj port 465).

3. **Logi backendu na Renderze**  
   Web Service → **Logs**. Przy wysyłce checklisty szukaj wpisów `[EMAIL]` – tam są dokładne błędy SMTP.

## Uwagi

- Zmienne ustawiasz **tylko w Web Service (backend)**. W Static Site (frontend) nie ustawiaj haseł SMTP.
- `ADMIN_EMAIL` – na ten adres trafia lista z formularza (np. ten sam co SMTP_USER).
