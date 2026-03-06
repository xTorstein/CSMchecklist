# 🚀 Komendy do wgrania na GitHub

## ⚠️ WAŻNE: Sprawdź przed wykonaniem!

Upewnij się że:
- ✅ `.env` jest w `.gitignore` (już jest ✅)
- ✅ `hasło.txt` jest w `.gitignore` (dodane ✅)
- ✅ Baza danych (`*.sqlite`) jest ignorowana (już jest ✅)

---

## 📋 Komendy do wykonania (kolejno):

### 1. Przejdź do folderu projektu
```powershell
cd C:\Users\wikto\Desktop\server
```

### 2. Sprawdź status
```powershell
git status
```

### 3. Dodaj wszystkie zmiany
```powershell
git add .
```

### 4. Sprawdź co zostanie dodane (upewnij się że NIE MA .env i hasło.txt)
```powershell
git status
```

### 5. Rozwiąż konflikty z GitHubem (jeśli są)
```powershell
git pull --rebase origin main
```

Jeśli są konflikty, rozwiąż je i wykonaj:
```powershell
git rebase --continue
```

### 6. Utwórz commit
```powershell
git commit -m "Aktualizacja aplikacji - poprawki email, PWA i bezpieczeństwo"
```

### 7. Wgraj na GitHub
```powershell
git push origin main
```

---

## ✅ Sprawdź na GitHubie

1. Przejdź na: https://github.com/czopekwiktor1-bit/CSMchecklist
2. Sprawdź czy wszystkie pliki są tam
3. **Upewnij się że `.env` i `hasło.txt` NIE MA na liście!**

---

## 🆘 Jeśli coś pójdzie nie tak

### Problem: "diverged branches"
```powershell
git pull --rebase origin main
# Rozwiąż konflikty jeśli są
git push origin main
```

### Problem: "Permission denied"
Sprawdź czy jesteś zalogowany na GitHubie w przeglądarce.

### Problem: Chcesz nadpisać zmiany na GitHubie (OSTROŻNIE!)
```powershell
git push --force origin main
```
**Uwaga:** To nadpisze zmiany na GitHubie - używaj tylko jeśli jesteś pewien!

---

**Gotowe!** 🎉
