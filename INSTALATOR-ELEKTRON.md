# Instalator desktopowy (Electron) – CSM Checklist

Aplikacja w wersji desktopowej: użytkownik pobiera plik **.exe** (Windows) lub **.dmg** (Mac), instaluje i uruchamia program z ikony na pulpicie. W środku działa ta sama strona co w przeglądarce (hosting na Renderze).

---

## Wymagania

- **Node.js** 18 lub nowszy ([nodejs.org](https://nodejs.org))
- **Windows:** do zbudowania instalatora .exe możesz budować na Windows lub (przez CI) na Linux
- **Mac:** do zbudowania .dmg potrzebny jest komputer z macOS

---

## Kroki – budowanie instalatora

### 1. Zainstaluj zależności Electrona

W katalogu projektu (tam gdzie jest folder `electron/`):

```bash
cd electron
npm install
```

### 2. (Opcjonalnie) Własna ikona aplikacji

Jeśli chcesz własną ikonę w instalatorze i na pasku zadań:

1. Umieść plik **icon.png** (np. 256×256 px) w folderze **electron/**.
2. Możesz wygenerować ikonę w przeglądarce: otwórz **client/public/create-icons.html**, zapisz wygenerowany plik (np. icon-512.png) jako **electron/icon.png**.
3. W **electron/package.json** w sekcji `"build"`:
   - w `"files"` dopisz `"icon.png"` (np. `"files": ["main.js", "icon.png"]`),
   - w `"win"` dodaj `"icon": "icon.png"`,
   - w `"mac"` dodaj `"icon": "icon.png"`.

Bez tego kroku aplikacja zbuduje się z domyślną ikoną Electrona.

### 3. Adres aplikacji (domyślnie Render)

Aplikacja desktopowa otwiera w oknie stronę z hostingu. Domyślny adres to:

`https://csmchecklist-frontend.onrender.com`

Jeśli Twój frontend jest pod innym adresem, przed budowaniem ustaw zmienną środowiskową:

**Windows (PowerShell):**
```powershell
$env:ELECTRON_APP_URL = "https://twoj-frontend.onrender.com"
cd electron
npm run build:win
```

**Windows (cmd):**
```cmd
set ELECTRON_APP_URL=https://twoj-frontend.onrender.com
cd electron
npm run build:win
```

**Linux / macOS:**
```bash
export ELECTRON_APP_URL=https://twoj-frontend.onrender.com
cd electron
npm run build:win
```
(lub `npm run build:mac` na Macu)

### 4. Zbuduj instalator

**Tylko Windows (.exe + instalator NSIS + wersja portable):**
```bash
cd electron
npm run build:win
```

**Tylko macOS (.dmg):**
```bash
cd electron
npm run build:mac
```

**Windows i Mac (jeśli jesteś na Macu z Cross-compilation lub budujesz osobno na każdej platformie):**
```bash
cd electron
npm run build:all
```

Po zakończeniu pliki instalatorów znajdziesz w:

- **electron/dist/**  
  - Windows: `CSM Checklist Setup 1.0.0.exe` (instalator), `CSM Checklist 1.0.0.exe` (portable)
  - Mac: `CSM Checklist 1.0.0.dmg`

---

## Jak zaktualizować instalator na GitHubie

Gdy wprowadzisz zmiany w **stronie** (frontend/backend) i wrzucisz je na GitHub, Render sam zaktualizuje stronę – użytkownicy z już zainstalowaną aplikacją desktopową po uruchomieniu programu i tak zobaczą nową wersję (aplikacja ładuje stronę z internetu).

**Nowy plik .exe na GitHubie** (nowy release) jest potrzebny tylko gdy:
- zmieniasz coś w **aplikacji desktopowej** (np. adres URL w `electron/main.js`), albo
- chcesz wypuścić „oficjalną” nową wersję do pobrania (np. v1.0.1) z opisem zmian.

### Kroki: nowa wersja instalatora na GitHubie

1. **Zwiększ numer wersji** w `electron/package.json`:
   - zmień `"version": "1.0.0"` na np. `"version": "1.0.1"` (lub 1.1.0, 2.0.0 – według uznania).

2. **Zbuduj instalator** (w terminalu, w folderze projektu):
   ```bash
   cd electron
   npm run build:win
   ```

3. **Sprawdź pliki** w `electron/dist/` – będą np. `CSM Checklist Setup 1.0.1.exe` i `CSM Checklist 1.0.1.exe`.

4. **Nowy release na GitHubie:**
   - GitHub → Twoje repo → **Releases** → **Draft a new release** (lub **Create a new release**).
   - **Choose a tag:** wpisz nowy tag, np. `v1.0.1` → **Create new tag**.
   - **Release title:** np. `CSM Checklist v1.0.1`.
   - **Describe:** krótko, co się zmieniło (np. „Aktualizacja linku do aplikacji”).
   - W **Attach binaries** przeciągnij z folderu `electron/dist/` plik **CSM Checklist Setup 1.0.1.exe** (i ewentualnie portable).
   - **Publish release**.

5. **(Opcjonalnie)** Zapisz zmiany wersji w repo:
   ```bash
   git add electron/package.json
   git commit -m "Bump desktop app version to 1.0.1"
   git push
   ```

Gotowe – link do nowej wersji to np.  
`https://github.com/xTorstein/CSMchecklist/releases/tag/v1.0.1`  
i bezpośrednie pobranie:  
`https://github.com/xTorstein/CSMchecklist/releases/download/v1.0.1/CSM.Checklist.Setup.1.0.1.exe`.

---

## Gdzie udostępnić instalatory użytkownikom

1. **GitHub Releases (zalecane)**  
   - W repozytorium: **Releases** → **Create a new release** (np. tag `v1.0.0`).  
   - Do release’a dołącz pliki z **electron/dist/** (np. `CSM Checklist Setup 1.0.0.exe`, `CSM Checklist 1.0.0.dmg`).  
   - Użytkownicy pobierają stamtąd .exe lub .dmg i instalują.

2. **Własna strona / dysk**  
   - Wgraj pliki .exe / .dmg na swoją stronę lub Google Drive / OneDrive i podaj link do pobrania.

3. **Inne**  
   - Każde miejsce, skąd użytkownik może bezpiecznie pobrać plik (np. wewnętrzny serwer uczelni).

---

## Co mówić użytkownikom

- **Windows:** Pobierz plik **„CSM Checklist Setup 1.0.0.exe”**, uruchom, przejdź kreator instalacji. Po instalacji uruchom **„CSM Checklist”** z menu Start lub z pulpitu.  
- **Mac:** Pobierz plik **„CSM Checklist 1.0.0.dmg”**, otwórz, przeciągnij aplikację do folderu Aplikacje. Uruchom z Launchpada lub z Aplikacji.

Aplikacja otworzy okno z Twoją stroną (Render); logowanie i działanie jest takie samo jak w przeglądarce.

---

## Rozwiązywanie problemów

- **„npm run build:win” nie znaleziono**  
  Uruchamiaj polecenia z folderu **electron** (po `cd electron`).

- **Błąd przy budowaniu na Macu (dmg)**  
  Budowanie instalatorów Mac musi odbywać się na komputerze z systemem macOS.

- **W aplikacji widać starą wersję strony**  
  Aplikacja ładuje stronę z internetu (Render). Upewnij się, że frontend na Renderze jest zaktualizowany; ewentualnie w aplikacji użyj odświeżenia (Ctrl+R / Cmd+R).

- **Chcę zmienić adres URL na stałe**  
  W pliku **electron/main.js** zmień linię z `APP_URL` na swój adres i ponownie zbuduj instalator.
