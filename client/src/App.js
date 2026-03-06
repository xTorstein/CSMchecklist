import React, { useState } from 'react';
import './App.css';
import ChecklistForm from './components/ChecklistForm';
import SuccessMessage from './components/SuccessMessage';
import InstallScreen from './components/InstallScreen';

function App() {
  const [submitted, setSubmitted] = useState(false);
  const [checklistId, setChecklistId] = useState(null);
  const [emailSent, setEmailSent] = useState(true);
  const [showInstall, setShowInstall] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('install') === '1';
  });

  const handleOpenApp = () => {
    window.history.replaceState({}, '', window.location.pathname);
    setShowInstall(false);
  };

  const handleSubmitSuccess = (data) => {
    setChecklistId(data.checklistId);
    setEmailSent(data.emailSent !== false);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setChecklistId(null);
    setEmailSent(true);
  };

  if (showInstall) {
    return <InstallScreen onOpenApp={handleOpenApp} />;
  }

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>CSM Checklist</h1>
          <p className="subtitle">Kierunek: Pielęgniarstwo</p>
        </header>

        {!submitted ? (
          <ChecklistForm onSuccess={handleSubmitSuccess} />
        ) : (
          <SuccessMessage checklistId={checklistId} emailSent={emailSent} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}

export default App;

