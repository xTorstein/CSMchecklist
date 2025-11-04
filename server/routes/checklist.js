const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const emailService = require('../services/emailService');

const db = new sqlite3.Database('./database.sqlite');

// Create new checklist
router.post('/create', async (req, res) => {
  try {
    const { lecturerName, lecturerEmail, subjectName, dateNeeded, items, additionalNotes } = req.body;

    // Validate required fields
    if (!lecturerName || !lecturerEmail || !subjectName || !dateNeeded || !items || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Wszystkie wymagane pola muszą być wypełnione' 
      });
    }

    // Insert into database
    const itemsJson = JSON.stringify(items);
    
    db.run(
      `INSERT INTO checklists (lecturer_name, lecturer_email, subject_name, date_needed, items, additional_notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [lecturerName, lecturerEmail, subjectName, dateNeeded, itemsJson, additionalNotes || ''],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ 
            success: false, 
            error: 'Błąd podczas zapisywania checklisty' 
          });
        }

        const checklistId = this.lastID;

        // Send email notification
        emailService.sendChecklistEmail({
          lecturerName,
          lecturerEmail,
          subjectName,
          dateNeeded,
          items,
          additionalNotes,
          checklistId
        }).catch(err => {
          console.error('Email error:', err);
          // Don't fail the request if email fails
        });

        res.json({
          success: true,
          checklistId: checklistId,
          message: 'Checklista została wysłana pomyślnie'
        });
      }
    );
  } catch (error) {
    console.error('Error creating checklist:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Wystąpił błąd podczas przetwarzania żądania' 
    });
  }
});

// Get all checklists
router.get('/all', (req, res) => {
  db.all('SELECT * FROM checklists ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        success: false, 
        error: 'Błąd podczas pobierania checklist' 
      });
    }

    const checklists = rows.map(row => ({
      ...row,
      items: JSON.parse(row.items)
    }));

    res.json({
      success: true,
      checklists: checklists
    });
  });
});

// Get checklist by ID
router.get('/:id', (req, res) => {
  const id = req.params.id;

  db.get('SELECT * FROM checklists WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        success: false, 
        error: 'Błąd podczas pobierania checklisty' 
      });
    }

    if (!row) {
      return res.status(404).json({ 
        success: false, 
        error: 'Checklista nie została znaleziona' 
      });
    }

    res.json({
      success: true,
      checklist: {
        ...row,
        items: JSON.parse(row.items)
      }
    });
  });
});

module.exports = router;

