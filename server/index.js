require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const checklistRoutes = require('./routes/checklist');
const emailService = require('./services/emailService');

// Server initialization

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/checklist', checklistRoutes);

// Health check endpoint (includes email config status for debugging)
app.get('/api/health', (req, res) => {
  const emailConfigured = emailService.isEmailConfigured();
  const emailProvider = process.env.RESEND_API_KEY ? 'resend' : (process.env.SMTP_USER ? 'smtp' : 'none');
  res.json({
    status: 'OK',
    message: 'Server is running',
    emailConfigured,
    emailProvider
  });
});

// Test email endpoint – open in browser to verify SMTP (e.g. https://your-backend.onrender.com/api/email-test)
app.get('/api/email-test', async (req, res) => {
  try {
    const result = await emailService.sendTestEmail();
    res.json(result);
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message || String(err) });
  }
});

// Initialize database
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    
    // Create tables
    db.run(`CREATE TABLE IF NOT EXISTS checklists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lecturer_name TEXT NOT NULL,
      lecturer_email TEXT NOT NULL,
      subject_name TEXT NOT NULL,
      date_needed TEXT NOT NULL,
      items TEXT NOT NULL,
      additional_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Database tables initialized');
      }
    });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed');
      }
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed');
      }
      process.exit(0);
    });
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit - log and continue
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit - log and continue
});

module.exports = { app, db, server };

