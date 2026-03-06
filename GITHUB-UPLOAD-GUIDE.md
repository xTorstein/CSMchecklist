# 📤 Przewodnik: Wgrywanie aplikacji na GitHub

## ⚠️ WAŻNE - Bezpieczeństwo przed wgraniem

### 1. Sprawdź czy plik `.env` jest ignorowany

Plik `.env` zawiera wrażliwe dane (hasła email) i **NIE MOŻE** trafić na GitHub!

Sprawdź czy w `.gitignore` jest:
```
.env
.env.local
```

✅ Jeśli tak - jesteś bezpieczny!  
❌ Jeśli nie - dodaj `.env` do `.gitignore` przed commitowaniem!

### 2. Usuń pliki z hasłami

Jeśli masz pliki typu `hasło.txt`, `passwords.txt` itp. - **usuń je** lub dodaj do `.gitignore`!

---

## 🚀 Krok po kroku - Wgranie na GitHub

### Krok 1: Sprawdź status repozytorium

```bash
cd C:\Users\wikto\Desktop\server
git status
```

Zobaczysz listę zmienionych plików.

### Krok 2: Dodaj wszystkie zmiany

```bash
git add .
```

**UWAGA:** To doda wszystkie pliki oprócz tych w `.gitignore` (np. `.env`, `node_modules`, `*.sqlite`)

### Krok 3: Sprawdź co zostanie dodane (opcjonalnie)

```bash
git status
```

Upewnij się, że **NIE MA** plików:
- ❌ `.env`
- ❌ `*.sqlite` (baza danych)
- ❌ `hasło.txt` lub podobnych
- ❌ `node_modules/`

### Krok 4: Utwórz commit

```bash
git commit -m "Aktualizacja aplikacji checklisty - poprawki email i PWA"
```

Możesz użyć własnej wiadomości, np:
- `"Dodano obsługę email i konfigurację PWA"`
- `"Poprawki błędów i optymalizacja"`
- `"Finalna wersja aplikacji"`

### Krok 5: Rozwiąż konflikty (jeśli są)

Jeśli widzisz komunikat o diverged branches:

```bash
# Opcja A: Pull z rebase (zalecane)
git pull --rebase origin main

# Opcja B: Pull z merge
git pull origin main

# Opcja C: Force push (TYLKO jeśli jesteś pewien że chcesz nadpisać remote)
git push --force origin main
```

**Uwaga:** Force push może nadpisać zmiany na GitHubie - używaj ostrożnie!

### Krok 6: Wgraj na GitHub

```bash
git push origin main
```

Jeśli to pierwszy raz, możesz potrzebować:

```bash
git push -u origin main
```

### Krok 7: Sprawdź na GitHub

1. Przejdź na https://github.com
2. Znajdź swoje repozytorium
3. Sprawdź czy wszystkie pliki są tam
4. **Upewnij się że `.env` NIE MA na liście plików!**

---

## 🔧 Rozwiązywanie problemów

### Problem: "Your branch and 'origin/main' have diverged"

**Rozwiązanie:**
```bash
# Pobierz zmiany z GitHub
git pull --rebase origin main

# Rozwiąż konflikty jeśli są, potem:
git push origin main
```

### Problem: "Permission denied"

**Rozwiązanie:**
1. Sprawdź czy jesteś zalogowany: `git config user.name`
2. Ustaw użytkownika:
   ```bash
   git config user.name "TwojaNazwa"
   git config user.email "twoj@email.com"
   ```
3. Jeśli używasz HTTPS, możesz potrzebować Personal Access Token zamiast hasła

### Problem: "Repository not found"

**Rozwiązanie:**
1. Sprawdź czy repozytorium istnieje na GitHubie
2. Sprawdź remote:
   ```bash
   git remote -v
   ```
3. Jeśli trzeba, dodaj remote:
   ```bash
   git remote add origin https://github.com/TWOJA-NAZWA/TWOJE-REPO.git
   ```

### Problem: Chcę utworzyć nowe repozytorium

**Rozwiązanie:**

1. **Na GitHubie:**
   - Przejdź na https://github.com
   - Kliknij "+" → "New repository"
   - Nazwa: np. `csm-checklist`
   - Opis: "Aplikacja checklisty dla wykładowców"
   - Public lub Private (wybierz)
   - **NIE zaznaczaj** "Initialize with README"
   - Kliknij "Create repository"

2. **Lokalnie:**
   ```bash
   cd C:\Users\wikto\Desktop\server
   
   # Jeśli jeszcze nie ma git:
   git init
   
   # Dodaj remote (zastąp URL swoim):
   git remote add origin https://github.com/TWOJA-NAZWA/csm-checklist.git
   
   # Dodaj pliki:
   git add .
   
   # Commit:
   git commit -m "Initial commit - aplikacja checklisty"
   
   # Push:
   git push -u origin main
   ```

---

## ✅ Checklist przed pushowaniem

Przed `git push`, upewnij się że:

- [ ] `.env` jest w `.gitignore` ✅
- [ ] `*.sqlite` (baza danych) jest w `.gitignore` ✅
- [ ] `node_modules/` jest w `.gitignore` ✅
- [ ] Nie ma plików z hasłami w repozytorium ✅
- [ ] Wszystkie zmiany są commitowane ✅
- [ ] README.md jest aktualny ✅

---

## 📝 Co powinno być na GitHubie

✅ **TAK - dodaj:**
- Kod źródłowy (`server/`, `client/`)
- `package.json` (wszystkie)
- `README.md`
- `.gitignore`
- `env.example` (przykładowa konfiguracja)
- Dokumentacja (`INSTALACJA-MOBILNA.md`, `QUICK-START.md`)

❌ **NIE - nie dodawaj:**
- `.env` (wrażliwe dane)
- `*.sqlite` (baza danych)
- `node_modules/` (zależności)
- Pliki z hasłami
- Pliki tymczasowe

---

## 🎯 Szybkie komendy (copy-paste)

```bash
# Przejdź do folderu projektu
cd C:\Users\wikto\Desktop\server

# Sprawdź status
git status

# Dodaj wszystkie zmiany
git add .

# Sprawdź co zostanie dodane
git status

# Commit
git commit -m "Aktualizacja aplikacji checklisty"

# Pull (jeśli są zmiany na GitHubie)
git pull --rebase origin main

# Push
git push origin main
```

---

## 💡 Wskazówki

1. **Regularne commity:** Commituj często, małymi porcjami
2. **Opisowe komunikaty:** Używaj jasnych komunikatów commitów
3. **Sprawdzaj przed push:** Zawsze sprawdź `git status` przed pushowaniem
4. **Backup:** GitHub jest też backupem - warto pushować regularnie

---

**Gotowe!** Twoja aplikacja jest teraz na GitHubie! 🎉
