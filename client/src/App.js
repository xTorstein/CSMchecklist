import React, { useState } from 'react';
import './App.css';
import ChecklistForm from './components/ChecklistForm';
import SuccessMessage from './components/SuccessMessage';

function App() {
  const [submitted, setSubmitted] = useState(false);
  const [checklistId, setChecklistId] = useState(null);

  const handleSubmitSuccess = (id) => {
    setChecklistId(id);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setChecklistId(null);
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
          <SuccessMessage checklistId={checklistId} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}

export default App;

