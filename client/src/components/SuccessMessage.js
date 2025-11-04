import React from 'react';
import './SuccessMessage.css';

const SuccessMessage = ({ checklistId, onReset }) => {
  return (
    <div className="success-message">
      <div className="success-icon">✓</div>
      <h2>Checklista została wysłana!</h2>
      <p className="success-text">
        Twoja checklista została pomyślnie utworzona i email został wysłany do administratora.
      </p>
      {checklistId && (
        <p className="checklist-id">
          ID Checklisty: <strong>#{checklistId}</strong>
        </p>
      )}
      <button onClick={onReset} className="btn-reset">
        Wypełnij nową checklistę
      </button>
    </div>
  );
};

export default SuccessMessage;

