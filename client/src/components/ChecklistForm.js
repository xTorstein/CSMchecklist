import React, { useState } from 'react';
import axios from 'axios';
import './ChecklistForm.css';

const ChecklistForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    lecturerName: '',
    lecturerEmail: '',
    subjectName: '',
    dateNeeded: '',
    items: [{ name: '', quantity: '' }],
    additionalNotes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: '' }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate form
    if (!formData.lecturerName || !formData.lecturerEmail || 
        !formData.subjectName || !formData.dateNeeded) {
      setError('Proszę wypełnić wszystkie wymagane pola');
      setLoading(false);
      return;
    }

    // Filter out empty items
    const validItems = formData.items.filter(item => item.name.trim() !== '');

    if (validItems.length === 0) {
      setError('Proszę dodać przynajmniej jeden element do checklisty');
      setLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.lecturerEmail)) {
      setError('Proszę podać poprawny adres email');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/checklist/create', {
        lecturerName: formData.lecturerName,
        lecturerEmail: formData.lecturerEmail,
        subjectName: formData.subjectName,
        dateNeeded: formData.dateNeeded,
        items: validItems,
        additionalNotes: formData.additionalNotes
      });

      if (response.data.success) {
        onSuccess(response.data.checklistId);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Wystąpił błąd podczas wysyłania checklisty');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checklist-form">
      <div className="form-section">
        <h2>Dane wykładowcy</h2>
        
        <div className="form-group">
          <label htmlFor="lecturerName">
            Imię i nazwisko <span className="required">*</span>
          </label>
          <input
            type="text"
            id="lecturerName"
            name="lecturerName"
            value={formData.lecturerName}
            onChange={handleInputChange}
            placeholder="np. Dr Jan Kowalski"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lecturerEmail">
            Email <span className="required">*</span>
          </label>
          <input
            type="email"
            id="lecturerEmail"
            name="lecturerEmail"
            value={formData.lecturerEmail}
            onChange={handleInputChange}
            placeholder="jan.kowalski@example.com"
            required
          />
        </div>
      </div>

      <div className="form-section">
        <h2>Informacje o zajęciach</h2>
        
        <div className="form-group">
          <label htmlFor="subjectName">
            Nazwa przedmiotu <span className="required">*</span>
          </label>
          <input
            type="text"
            id="subjectName"
            name="subjectName"
            value={formData.subjectName}
            onChange={handleInputChange}
            placeholder="np. Podstawy pielęgniarstwa"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dateNeeded">
            Data zajęć <span className="required">*</span>
          </label>
          <input
            type="date"
            id="dateNeeded"
            name="dateNeeded"
            value={formData.dateNeeded}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="form-section">
        <h2>Zapotrzebowanie</h2>
        <p className="section-description">
          Dodaj wszystkie elementy, które muszą być przygotowane na zajęcia
        </p>

        {formData.items.map((item, index) => (
          <div key={index} className="item-row">
            <div className="item-name">
              <input
                type="text"
                placeholder="Nazwa materiału/rzeczy"
                value={item.name}
                onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                required={index === 0}
              />
            </div>
            <div className="item-quantity">
              <input
                type="text"
                placeholder="Ilość (opcjonalnie)"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
              />
            </div>
            {formData.items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="btn-remove"
                aria-label="Usuń element"
              >
                ×
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="btn-add-item"
        >
          + Dodaj kolejny element
        </button>
      </div>

      <div className="form-section">
        <div className="form-group">
          <label htmlFor="additionalNotes">Dodatkowe uwagi (opcjonalnie)</label>
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleInputChange}
            placeholder="Dodatkowe informacje, które mogą być pomocne..."
            rows="4"
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button
        type="submit"
        className="btn-submit"
        disabled={loading}
      >
        {loading ? 'Wysyłanie...' : 'Wyślij checklistę'}
      </button>
    </form>
  );
};

export default ChecklistForm;

