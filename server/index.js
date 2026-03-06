require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sqlite3 = require('sqlite3').verbose();
const checklistRoutes = require('./routes/checklist');
const emailService = require('./services/emailService');

const app = express();
const PORT = process.env.PORT || 5000;

// Security: headers
app.use(helmet({ contentSecurityPolicy: false }));

// Security: limit body size (100 KB)
app.use(bodyParser.json({ limit: '100kb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100kb' }));

// Security: CORS – w produkcji dozwolone tylko z frontendu (Render)
const corsOrigin = process.env.CORS_ORIGIN || process.env.FRONTEND_URL;
app.use(cors({
  origin: corsOrigin ? corsOrigin.split(',').map(s => s.trim()) : true,
  optionsSuccessStatus: 200
}));

// Security: rate limit – ogólny (100 żądań / 15 min na IP)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Zbyt wiele żądań. Spróbuj za chwilę.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', generalLimiter);

// Security: ostrzejszy limit dla tworzenia checklisty (20 / 15 min) i testu email (5 / 15 min)
const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, error: 'Zbyt wiele wysyłek. Poczekaj chwilę.' },
  standardHeaders: true,
  legacyHeaders: false
});
const emailTestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { ok: false, error: 'Zbyt wiele prób. Poczekaj chwilę.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/checklist/create', createLimiter);

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

// Test email endpoint – rate limited (5 / 15 min)
app.get('/api/email-test', emailTestLimiter, async (req, res) => {
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

