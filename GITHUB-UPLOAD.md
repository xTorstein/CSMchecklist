# Jak wgrać katalog server na GitHub

## Metoda 1: Sprawdź czy katalog już istnieje (najszybsza)

1. **Przejdź na GitHub:**
   - Otwórz: https://github.com/czopekwiktor1-bit/CSMchecklist
   
2. **Sprawdź strukturę:**
   - Zobaczysz listę plików i folderów
   - Jeśli widzisz folder `server/` - kliknij w niego
   - Jeśli widzisz pliki `server/` w głównym katalogu - to jest OK
   - **Jeśli NIE widzisz katalogu `server/`** - przejdź do Metody 2

## Metoda 2: Wgraj przez przeglądarkę GitHub (najłatwiejsza)

### ⚠️ UWAGA: Limit 100 plików
GitHub przez przeglądarkę nie pozwala na wgranie więcej niż 100 plików na raz. Jeśli folder `server/` zawiera `node_modules/` (tysiące plików), użyj **Metody 3 lub 4** poniżej.

### Krok 1: Przygotuj pliki

Upewnij się, że masz katalog `server` lokalnie w projekcie:
```
Checklista dla wykładowcow/
├── server/          ← Ten folder musi istnieć
│   ├── index.js
│   ├── package.json
│   ├── routes/
│   └── services/
```

**WAŻNE:** Folder `server/` powinien mieć plik `.gitignore`, który wyklucza `node_modules/`.

### Krok 2: Wgraj na GitHub (tylko jeśli < 100 plików)

1. **Przejdź do repozytorium:**
   - https://github.com/czopekwiktor1-bit/CSMchecklist

2. **Kliknij "Add file"** (lub "Upload files")

3. **Przeciągnij folder `server/`** (BEZ `node_modules/`):
   - Otwórz Eksplorator Windows
   - Przejdź do: `C:\Users\wikto\Desktop\server\server`
   - Zaznacz tylko potrzebne pliki (NIE zaznaczaj `node_modules/`)

4. **Lub kliknij "choose your files"** i wybierz pliki z folderu `server` (bez `node_modules/`)

5. **Wypełnij formularz:**
   - **Commit message:** `Add server directory`
   - Kliknij **"Commit changes"** (lub "Commit directly to main branch")

### ⚠️ Ważne:
- **NIE wgrywaj `node_modules/`** - to są zależności, które są instalowane przez `npm install`
- Jeśli folder `server` już istnieje na GitHub, ale jest pusty, możesz go usunąć i wgrać ponownie
- GitHub automatycznie wykryje strukturę folderów

## Metoda 3: Zainstaluj Git i użyj komend (bardziej profesjonalne)

### Krok 1: Zainstaluj Git

1. Pobierz Git: https://git-scm.com/download/win
2. Zainstaluj (domyślne ustawienia są OK)
3. Zrestartuj terminal

### Krok 2: Wgraj kod

```bash
# W terminalu PowerShell
cd "C:\Users\wikto\Desktop\Checklista dla wykładowcow"

# Inicjalizuj git (jeśli jeszcze nie)
git init

# Dodaj wszystkie pliki
git add .

# Zrób commit
git commit -m "Add server directory and all files"

# Połącz z GitHub (jeśli jeszcze nie)
git remote add origin https://github.com/czopekwiktor1-bit/CSMchecklist.git

# Wyślij na GitHub
git branch -M main
git push -u origin main
```

## Metoda 4: GitHub Desktop (najłatwiejsza z GUI)

1. **Pobierz GitHub Desktop:**
   - https://desktop.github.com/

2. **Zainstaluj i zaloguj się**

3. **Dodaj repozytorium:**
   - File → Add Local Repository
   - Wybierz folder: `C:\Users\wikto\Desktop\Checklista dla wykładowcow`
   - Kliknij "Add repository"

4. **Commit i Push:**
   - W lewym panelu zobaczysz wszystkie zmiany
   - Wpisz wiadomość: "Add server directory"
   - Kliknij "Commit to main"
   - Kliknij "Push origin"

## Weryfikacja - sprawdź czy działa

1. **Na GitHub:**
   - Przejdź do: https://github.com/czopekwiktor1-bit/CSMchecklist
   - Powinieneś zobaczyć folder `server/`
   - Kliknij w niego
   - Powinieneś zobaczyć pliki: `index.js`, `package.json`, `routes/`, `services/`

2. **W Render:**
   - Wróć do Render Dashboard
   - Kliknij "Manual Deploy" → "Deploy latest commit"
   - Tym razem powinno działać!

## Struktura katalogów na GitHub powinna wyglądać tak:

```
CSMchecklist/
├── server/              ← Ten folder MUSI być widoczny
│   ├── index.js
│   ├── package.json
│   ├── env.example
│   ├── routes/
│   │   └── checklist.js
│   └── services/
│       └── emailService.js
├── client/
│   ├── src/
│   └── public/
├── README.md
└── package.json
```

## Jeśli nadal nie działa:

1. **Sprawdź czy wszystkie pliki są w folderze `server/`:**
   - `index.js`
   - `package.json`
   - `routes/checklist.js`
   - `services/emailService.js`

2. **Sprawdź konfigurację Render:**
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `node index.js`

