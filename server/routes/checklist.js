const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const emailService = require('../services/emailService');

// Get database instance from index.js
// This ensures we use the same database connection throughout the app
let db;
try {
  // Try to require the main module to get the db instance
  const mainModule = require.main;
  if (mainModule && mainModule.exports && mainModule.exports.db) {
    db = mainModule.exports.db;
  } else {
    // Fallback: create new database connection if main module not available
    console.warn('[ROUTES] Creating fallback database connection');
    db = new sqlite3.Database('./database.sqlite', (err) => {
      if (err) {
        console.error('Error opening database in routes:', err.message);
      } else {
        console.log('[ROUTES] Fallback database connection opened');
      }
    });
  }
} catch (error) {
  // If anything fails, create new database connection
  console.warn('[ROUTES] Error getting shared db, creating new connection:', error.message);
  db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
      console.error('Error opening database in routes:', err.message);
    } else {
      console.log('[ROUTES] Fallback database connection opened');
    }
  });
}

// Limity długości (ochrona przed nadmiernymi danymi)
const MAX_TEXT = 500;
const MAX_NOTES = 2000;
const MAX_ITEMS = 100;
const MAX_ITEM_NAME = 300;

function trimStr(s) {
  return typeof s === 'string' ? s.trim().slice(0, MAX_TEXT) : '';
}

// Create new checklist
router.post('/create', async (req, res) => {
  try {
    let { lecturerName, lecturerEmail, subjectName, dateNeeded, items, additionalNotes } = req.body;

    // Validate required fields
    if (!lecturerName || !lecturerEmail || !subjectName || !dateNeeded || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Wszystkie wymagane pola muszą być wypełnione'
      });
    }

    if (items.length > MAX_ITEMS) {
      return res.status(400).json({
        success: false,
        error: `Maksymalnie ${MAX_ITEMS} pozycji na listę.`
      });
    }

    lecturerName = trimStr(lecturerName);
    lecturerEmail = trimStr(lecturerEmail);
    subjectName = trimStr(subjectName);
    dateNeeded = trimStr(dateNeeded);
    additionalNotes = typeof additionalNotes === 'string' ? additionalNotes.trim().slice(0, MAX_NOTES) : '';

    if (!lecturerName || !lecturerEmail || !subjectName || !dateNeeded) {
      return res.status(400).json({
        success: false,
        error: 'Wszystkie wymagane pola muszą być wypełnione'
      });
    }

    // Walidacja email (prosta)
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(lecturerEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Nieprawidłowy adres email.'
      });
    }

    items = items.map((it, i) => {
      const name = typeof it?.name === 'string' ? it.name.trim().slice(0, MAX_ITEM_NAME) : String(it?.name ?? '').slice(0, MAX_ITEM_NAME);
      const quantity = typeof it?.quantity === 'string' ? it.quantity.trim().slice(0, 50) : (it?.quantity != null ? String(it.quantity) : '');
      return { name, quantity };
    }).filter(it => it.name.length > 0);

    if (items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Dodaj co najmniej jedną pozycję z nazwą.'
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

        // Send email and wait up to 10s so we can report if it succeeded
        console.log('📝 [CHECKLIST] Wysyłanie emaila dla checklisty ID:', checklistId);
        const emailPromise = emailService.sendChecklistEmail({
          lecturerName,
          lecturerEmail,
          subjectName,
          dateNeeded,
          items,
          additionalNotes,
          checklistId
        });
        const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 10000));
        Promise.race([emailPromise, timeoutPromise])
          .then((emailResult) => {
            if (emailResult) {
              console.log('✅ [CHECKLIST] Email wysłany pomyślnie dla checklisty ID:', checklistId);
            } else {
              console.warn('⚠️ [CHECKLIST] Email nie został wysłany dla checklisty ID:', checklistId);
            }
            res.json({
              success: true,
              checklistId: checklistId,
              message: 'Checklista została wysłana pomyślnie',
              emailSent: !!emailResult
            });
          })
          .catch((err) => {
            console.error('❌ [CHECKLIST] Email error:', err.message || err);
            res.json({
              success: true,
              checklistId: checklistId,
              message: 'Checklista została wysłana pomyślnie',
              emailSent: false
            });
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

    const checklists = rows.map(row => {
      try {
        return {
          ...row,
          items: JSON.parse(row.items)
        };
      } catch (parseError) {
        console.error('Error parsing items JSON for checklist ID:', row.id, parseError);
        return {
          ...row,
          items: [] // Fallback to empty array if JSON parse fails
        };
      }
    });

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

    try {
      res.json({
        success: true,
        checklist: {
          ...row,
          items: JSON.parse(row.items)
        }
      });
    } catch (parseError) {
      console.error('Error parsing items JSON for checklist ID:', id, parseError);
      res.status(500).json({
        success: false,
        error: 'Błąd podczas parsowania danych checklisty'
      });
    }
  });
});

module.exports = router;


