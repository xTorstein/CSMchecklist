# Instalacja aplikacji CSM Checklist

Instrukcja dla **użytkowników** – jak zainstalować aplikację na telefonie lub komputerze (ikona na pulpicie).

---

## Link do instalacji (zalecany)

**Udostępnij użytkownikom ten link** – po wejściu od razu zobaczą ekran „Zainstaluj” i jednym przyciskiem dodadzą ikonę na pulpicie:

```
https://TWOJ-FRONTEND.onrender.com/?install=1
```

Zamień `TWOJ-FRONTEND.onrender.com` na **właściwy adres frontendu** (Static Site na Renderze).  
Gdzie go znaleźć: [dashboard.render.com](https://dashboard.render.com) → **Static Site** (frontend) → URL u góry strony.

- **Telefon / komputer (Chrome, Edge):** po wejściu w link → przycisk **„Zainstaluj na tym urządzeniu”** → potwierdzenie w przeglądarce → ikona pojawia się na pulpicie.
- **iPhone / iPad:** ten sam link w **Safari** – na ekranie instalacji zobaczysz krótką instrukcję (Udostępnij → Dodaj do ekranu początkowego).

---

## Link do aplikacji (bez instalacji)

Jeśli ktoś nie chce instalować, może otworzyć sam adres frontendu (bez `?install=1`):

- **Strona (frontend):** `https://TWOJ-FRONTEND.onrender.com`  
  Adres backendu (`...-backend.onrender.com`) **nie** służy do otwierania w przeglądarce – tylko frontend.

---

## Instalacja krok po kroku (gdy nie używasz linku z ?install=1)

### Telefon (Android)

1. Otwórz **link do aplikacji** w przeglądarce Chrome (zalecane).
2. Dotknij **menu** (trzy kropki) w prawym górnym rogu.
3. Wybierz **„Zainstaluj aplikację”** lub **„Dodaj do ekranu głównego”**.
4. Potwierdź – na ekranie pojawi się **ikona „CSM Checklist”**.  
   Odpalaj aplikację jak zwykłą aplikację z ekranu.

---

### Telefon (iPhone / iPad)

1. Otwórz **link do aplikacji** w **Safari** (nie w Chrome).
2. Dotknij ikonę **„Udostępnij”** (kwadrat ze strzałką w górę).
3. Przewiń w dół i wybierz **„Dodaj do ekranu początkowego”**.
4. Opcjonalnie zmień nazwę i dotknij **„Dodaj”**.  
   Ikona pojawi się na ekranie początkowym – uruchamiasz ją jak każdą inną aplikację.

---

### Komputer (Chrome / Edge)

1. Otwórz **link do aplikacji** w przeglądarce Chrome lub Edge.
2. W pasku adresu (po prawej) pojawi się ikona **„Zainstaluj”** (monitor z strzałką) – kliknij ją.  
   *Albo:* Menu (⋮) → **„Zainstaluj CSM Checklist…”** / **„Zainstaluj aplikację…”**.
3. Potwierdź instalację. Aplikacja otworzy się w osobnym oknie i będzie dostępna z menu Start / lista aplikacji.

---

## Po instalacji

- **Ikona** na ekranie głównym / pulpicie uruchamia aplikację w trybie „aplikacji” (pełny ekran, bez paska przeglądarki).
- **Internet** jest potrzebny przy wypełnianiu i wysyłaniu checklisty.
- W razie problemów – otwórz ten sam link w przeglądarce i spróbuj ponownie dodać do ekranu / zainstalować.

---

## Dla administratora

- **Wdrożenie (hosting):** zobacz [RENDER-QUICK-START.md](RENDER-QUICK-START.md).
- **Konfiguracja e-mail (Resend/SMTP):** zobacz [RENDER-EMAIL-SETUP.md](RENDER-EMAIL-SETUP.md).
- **Link do udostępnienia użytkownikom:** podaj adres **frontendu** (Static Site na Renderze), np.  
  `https://twoja-nazwa.onrender.com` – ten adres użytkownicy wpisują w przeglądarce i instalują według powyższej instrukcji.
