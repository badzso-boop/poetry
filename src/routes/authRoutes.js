// src/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db');

// Regisztráció
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Hasheljük a jelszót
  const hashedPassword = await bcrypt.hash(password, 10);

  const role = "user"
  try {
    // Vegyük fel az új felhasználót az adatbázisba
    await pool.query('INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)', [username, email, hashedPassword, role]);
    res.status(201).json({ message: 'Registration successful.' });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Bejelentkezés
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(username)

  try {
    // Ellenőrizzük a felhasználónevet és a jelszót
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length === 1) {
      const user = rows[0];

      // Ellenőrizzük a jelszót
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

      if (isPasswordValid) {
        // Sikeres bejelentkezés
        req.session.userId = user.user_id; // Példa: session használata
        req.session.username = user.username
        req.session.role = user.role

        res.json({ message: 'Login successful.', userId: user.user_id });
      } else {
        res.status(401).json({ error: 'Invalid password.' });
      }
    } else {
      res.status(404).json({ error: 'User not found.' });
    }
  } catch (error) {
    console.error('Error logging in:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Kijelentkezés
router.get('/logout', (req, res) => {
    // Töröljük a session-t
    req.session.destroy((err) => {
      if (err) {
        console.error('Error logging out:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'Logout successful.' });
      }
    });
});

// Azonosítás ellenőrzése
router.get('/check-auth', (req, res) => {
  if (req.session.userId) {
    res.json({ authenticated: true, userId: req.session.userId, username: req.session.username});
  } else {
    res.json({ authenticated: false });
  }
});

module.exports = router;
