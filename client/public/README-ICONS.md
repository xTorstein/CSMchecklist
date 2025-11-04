# Instrukcje dotyczące ikon PWA

Aplikacja wymaga ikon PWA do poprawnego działania jako aplikacja mobilna.

## Szybkie rozwiązanie

1. **Otwórz plik `create-icons.html` w przeglądarce:**
   - Przejdź do folderu `client/public/`
   - Otwórz `create-icons.html` w Chrome/Firefox
   - Ikony zostaną automatycznie pobrane

2. **Przenieś pobrane ikony:**
   - `icon-192.png` → `client/public/icon-192.png`
   - `icon-512.png` → `client/public/icon-512.png`

## Alternatywne rozwiązanie

Możesz użyć placeholder SVG jako ikony:
- Skopiuj `icon-placeholder.svg` jako `icon-192.png` i `icon-512.png`
- Lub użyj dowolnego narzędzia do konwersji SVG → PNG

## Wymagane rozmiary

- **icon-192.png**: 192x192 px (minimum)
- **icon-512.png**: 512x512 px (zalecane)

## Weryfikacja

Po dodaniu ikon, sprawdź w przeglądarce:
1. Otwórz DevTools (F12)
2. Przejdź do zakładki "Application" (Chrome) lub "Application" (Firefox)
3. Kliknij "Manifest" w lewym menu
4. Powinny być widoczne ikony

