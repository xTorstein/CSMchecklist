import React, { useState } from 'react';
import './App.css';
import ChecklistForm from './components/ChecklistForm';
import SuccessMessage from './components/SuccessMessage';

function App() {
  const [submitted, setSubmitted] = useState(false);
  const [checklistId, setChecklistId] = useState(null);
  const [emailSent, setEmailSent] = useState(true);

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

