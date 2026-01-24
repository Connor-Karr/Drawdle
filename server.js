const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('./drawdle.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS drawings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      drawing_data TEXT NOT NULL,
      date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      UNIQUE(user_id, date)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS daily_prompts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT UNIQUE NOT NULL,
      prompt TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database tables initialized');
}

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// ENDPOINT 1: User Registration
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Username or email already exists' });
          }
          return res.status(500).json({ error: 'Registration failed' });
        }

        const token = jwt.sign({ id: this.lastID, username }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
          message: 'User registered successfully',
          token,
          user: { id: this.lastID, username, email }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ENDPOINT 2: User Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  });
});

// ENDPOINT 3: Save Drawing
app.post('/api/drawings', authenticateToken, (req, res) => {
  const { title, drawingData, date } = req.body;
  const userId = req.user.id;

  if (!title || !drawingData || !date) {
    return res.status(400).json({ error: 'Title, drawing data, and date are required' });
  }

  db.run(
    'INSERT OR REPLACE INTO drawings (user_id, title, drawing_data, date) VALUES (?, ?, ?, ?)',
    [userId, title, drawingData, date],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to save drawing' });
      }

      res.status(201).json({
        message: 'Drawing saved successfully',
        drawingId: this.lastID
      });
    }
  );
});

// ENDPOINT 4: Get User's Drawings
app.get('/api/drawings', authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.all(
    'SELECT id, title, date, created_at FROM drawings WHERE user_id = ? ORDER BY date DESC',
    [userId],
    (err, drawings) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch drawings' });
      }
      res.json({ drawings });
    }
  );
});

// ENDPOINT 5: Get Specific Drawing
app.get('/api/drawings/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const drawingId = req.params.id;

  db.get(
    'SELECT * FROM drawings WHERE id = ? AND user_id = ?',
    [drawingId, userId],
    (err, drawing) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch drawing' });
      }

      if (!drawing) {
        return res.status(404).json({ error: 'Drawing not found' });
      }

      res.json({ drawing });
    }
  );
});

// ENDPOINT 6: Delete Drawing
app.delete('/api/drawings/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const drawingId = req.params.id;

  db.run(
    'DELETE FROM drawings WHERE id = ? AND user_id = ?',
    [drawingId, userId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete drawing' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Drawing not found' });
      }

      res.json({ message: 'Drawing deleted successfully' });
    }
  );
});

// ENDPOINT 7: Get Daily Prompt
app.get('/api/daily-prompt', (req, res) => {
  const today = new Date().toISOString().split('T')[0];

  db.get('SELECT * FROM daily_prompts WHERE date = ?', [today], (err, prompt) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch prompt' });
    }

    if (!prompt) {
      // Generate a random prompt if none exists
      const prompts = [
        'A cozy cabin in the mountains',
        'Your favorite animal',
        'A futuristic cityscape',
        'A magical forest',
        'Your dream vacation spot',
        'A friendly robot',
        'An underwater scene',
        'A space adventure',
        'Your happy place',
        'A fantasy creature'
      ];
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

      db.run(
        'INSERT INTO daily_prompts (date, prompt) VALUES (?, ?)',
        [today, randomPrompt],
        function (err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create prompt' });
          }
          res.json({ date: today, prompt: randomPrompt });
        }
      );
    } else {
      res.json(prompt);
    }
  });
});

// ENDPOINT 8: Get Today's Drawing
app.get('/api/drawings/today/:date', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const date = req.params.date;

  db.get(
    'SELECT * FROM drawings WHERE user_id = ? AND date = ?',
    [userId, date],
    (err, drawing) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch drawing' });
      }

      res.json({ drawing: drawing || null });
    }
  );
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});
