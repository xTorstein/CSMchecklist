import React, { useState, useEffect } from 'react';
import './InstallScreen.css';

function InstallScreen({ onOpenApp }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua) || (ua.includes('Mac') && 'ontouchend' in document));
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true);

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstalled(true);
      setDeferredPrompt(null);
    }
  };

  if (isStandalone) {
    return (
      <div className="install-screen">
        <div className="install-card">
          <div className="install-icon">✓</div>
          <h1>Aplikacja jest zainstalowana</h1>
          <p>Używasz CSM Checklist z ikony na pulpicie.</p>
          <button type="button" className="install-btn primary" onClick={onOpenApp}>
            Otwórz checklistę
          </button>
        </div>
      </div>
    );
  }

  if (installed) {
    return (
      <div className="install-screen">
        <div className="install-card">
          <div className="install-icon success">✓</div>
          <h1>Zainstalowano</h1>
          <p>Ikona pojawiła się na pulpicie. Otwórz aplikację stamtąd.</p>
          <button type="button" className="install-btn primary" onClick={onOpenApp}>
            Otwórz teraz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="install-screen">
      <div className="install-card">
        <div className="install-icon">📋</div>
        <h1>Zainstaluj CSM Checklist</h1>
        <p className="install-desc">
          Jedna ikona na pulpicie – szybki dostęp do checklisty bez wchodzenia w przeglądarkę.
        </p>

        {deferredPrompt && (
          <>
            <button type="button" className="install-btn primary" onClick={handleInstall}>
              Zainstaluj na tym urządzeniu
            </button>
            <p className="install-hint">Kliknij – pojawi się okno przeglądarki z potwierdzeniem. Po zatwierdzeniu ikona pojawi się na pulpicie.</p>
          </>
        )}

        {isIOS && !deferredPrompt && (
          <div className="install-ios">
            <p><strong>Na iPhone / iPad:</strong></p>
            <ol>
              <li>Otwórz tę stronę w <strong>Safari</strong></li>
              <li>Dotknij ikony <strong>„Udostępnij”</strong> (kwadrat ze strzałką)</li>
              <li>Wybierz <strong>„Dodaj do ekranu początkowego”</strong></li>
              <li>Potwierdź – ikona pojawi się na ekranie głównym</li>
            </ol>
          </div>
        )}

        {!deferredPrompt && !isIOS && (
          <p className="install-hint">
            Użyj Chrome lub Edge na tym urządzeniu – w menu przeglądarki wybierz „Zainstaluj aplikację” lub „Dodaj do ekranu głównego”.
          </p>
        )}

        <button type="button" className="install-btn secondary" onClick={onOpenApp}>
          Otwórz bez instalacji
        </button>
      </div>
    </div>
  );
}

export default InstallScreen;
