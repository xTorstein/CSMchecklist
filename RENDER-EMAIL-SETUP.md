# Konfiguracja email na Renderze (backend)

Aby lista z formularza była wysyłana na maila, w **Web Service** (backend) na Renderze ustaw zmienne środowiskowe. Masz dwie opcje.

---

## Opcja A: Resend (zalecane na Renderze)

**Resend** działa z chmury bez blokad. Gmail SMTP z Render często nie działa (blokada połączeń z serwerów hostingowych). Resend ma darmowy limit (np. 3000 maili/mies.) i wymaga tylko klucza API.

### Kroki

1. Załóż konto na [resend.com](https://resend.com) i zaloguj się.
2. W panelu: **API Keys** → **Create API Key** → skopiuj klucz (zaczyna się od `re_`).
3. (Opcjonalnie) W **Domains** dodaj i zweryfikuj domenę – wtedy maile mogą być „Od” twojego adresu. Do testów możesz zostawić domyślny nadawcę.
4. Na Renderze: Web Service (backend) → **Environment**. Dodaj:

   | Key | Value |
   |-----|--------|
   | `RESEND_API_KEY` | `re_xxxxxxxx` (twój klucz) |
   | `ADMIN_EMAIL` | adres, na który mają przychodzić checklisty |

   **Ważne:** Bez zweryfikowanej domeny Resend pozwala wysyłać **tylko na adres e-mail Twojego konta Resend** (ten, którym się rejestrowałeś). Ustaw więc **ADMIN_EMAIL** na ten sam adres (np. `wiktor.czopeki@gmail.com`) – wtedy maile z checklisty będą przychodzić na Twoją skrzynkę.

5. (Opcjonalnie) Aby wysyłać na **dowolny adres** (nie tylko na adres konta): w Resend wejdź w **Domains** → dodaj i zweryfikuj domenę ([resend.com/domains](https://resend.com/domains)). Potem na Renderze dodaj zmienną:
   - `RESEND_FROM_EMAIL` = `"CSM Checklist" <notifications@twoja-domena.pl>`  
   Wtedy możesz ustawić `ADMIN_EMAIL` na dowolny adres.

6. **Save Changes** – Render zrestartuje backend.

### Sprawdzenie

- Otwórz: `https://TWOJ-BACKEND.onrender.com/api/health` → powinno być `"emailConfigured": true`.
- Otwórz: `https://TWOJ-BACKEND.onrender.com/api/email-test` → odpowiedź `{"ok":true,...}` i mail na `ADMIN_EMAIL` (sprawdź też SPAM).

---

## Opcja B: SMTP (Gmail itd.)

Jeśli wolisz Gmail/SMTP, ustaw w Environment backendu:

| Key | Value (przykład) |
|-----|-------------------|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | `twoj-email@gmail.com` |
| `SMTP_PASS` | hasło aplikacji Gmail (nie zwykłe hasło) |
| `ADMIN_EMAIL` | adres na który mają przychodzić checklisty |

**Uwaga:** Z Render Gmail SMTP często nie działa (timeout / blokada). W takim przypadku użyj **Opcji A (Resend)**.

### Gmail – hasło aplikacji

- Konto Google → [Bezpieczeństwo](https://myaccount.google.com/security) → **Weryfikacja dwuetapowa** (włącz) → **Hasła aplikacji**.
- Wygeneruj hasło dla aplikacji i wklej je w `SMTP_PASS`.

---

## Sprawdzenie działania

1. **Health:** `https://TWOJ-BACKEND.onrender.com/api/health` → `emailConfigured: true`.
2. **Test maila:** `https://TWOJ-BACKEND.onrender.com/api/email-test` → `ok: true` i mail na `ADMIN_EMAIL`.
3. **Logi:** Web Service → **Logs**, szukaj wpisów `[EMAIL]`.

---

## Uwagi

- Zmienne ustawiasz **tylko w Web Service (backend)**. W Static Site (frontend) nie dodawaj kluczy API ani haseł.
- **Priorytet:** Jeśli ustawisz **RESEND_API_KEY** i **ADMIN_EMAIL**, aplikacja używa Resend i ignoruje SMTP. Żeby użyć Gmaila, nie ustawiaj `RESEND_API_KEY`.
