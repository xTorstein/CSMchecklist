# Zabezpieczenia aplikacji CSM Checklist

## Backend (serwer)

- **Nagłówki HTTP (Helmet)** – ustawiane są bezpieczne nagłówki (X-Content-Type-Options, itd.).
- **Limit rozmiaru body** – żądania większe niż 100 KB są odrzucane.
- **Rate limiting:**
  - **Ogólny:** 100 żądań na 15 minut na adres IP (całe API).
  - **Tworzenie checklisty (POST /api/checklist/create):** 20 żądań na 15 minut na IP.
  - **Test email (GET /api/email-test):** 5 żądań na 15 minut na IP.
- **CORS** – w produkcji warto ustawić `CORS_ORIGIN` lub `FRONTEND_URL` w zmiennych środowiskowych (adres frontendu na Renderze). Wtedy tylko ten adres może wywoływać API. Bez ustawienia dozwolone są wszystkie origin (wygodne przy rozwoju).
- **Walidacja wejścia (POST /create):**
  - wymagane pola i poprawny format (np. email),
  - maks. długości: tekst 500 znaków, uwagi 2000 znaków, nazwa pozycji 300 znaków,
  - maks. 100 pozycji na jedną checklistę,
  - dane są przycinane i filtrowane przed zapisem.
- **Baza danych** – zapytania używają parametrów (`?`), co chroni przed SQL injection.
- **Sekrety** – hasła i klucze API tylko w zmiennych środowiskowych (`.env` nie jest w repo).

## Frontend

- Aplikacja nie przechowuje ani nie wysyła haseł; do API trafiają tylko dane formularza.
- Render zapewnia HTTPS dla hostingu.

## Co ustawić na Renderze (backend)

W **Environment** Web Service (backend) możesz dodać:

- **CORS_ORIGIN** = `https://csmchecklist-frontend.onrender.com`  
  (dokładny adres Twojego frontendu) – wtedy tylko ten adres będzie mógł wysyłać żądania do API.  
  Więcej adresów: `https://adres1.onrender.com,https://adres2.pl` (oddzielone przecinkiem).

Bez tej zmiennej API przyjmuje żądania z dowolnej domeny (np. z localhost przy developmencie).
