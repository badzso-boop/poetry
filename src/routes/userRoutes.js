// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const User = require('../models/user');

// GET all users
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    const users = rows.map(row => new User(row.user_id, row.username, row.email, row.password_hash, row.profile_img_url, row.role));
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET a specific user
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [userId]);

    if (rows.length === 1) {
      const user = rows[0];
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE a user by ID
router.delete('/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const [result] = await pool.query('DELETE FROM users WHERE user_id = ?', [userId]);
  
      if (result.affectedRows === 1) {
        res.json({ message: 'User deleted successfully.' });
      } else {
        res.status(404).json({ error: 'User not found.' });
      }
    } catch (error) {
      console.error('Error deleting user:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT (update) a user by ID
router.put('/:userId', async (req, res) => {
    const userId = req.params.userId;
    const { username, email, password, profileImgUrl } = req.body;
  
    try {
      const [result] = await pool.query(
        'UPDATE users SET username = ?, email = ?, password_hash = ?, profile_image_url = ?, role = ? WHERE user_id = ?',
        [username, email, password, profileImgUrl, role, userId]
      );
  
      if (result.affectedRows === 1) {
        res.json({ message: 'User updated successfully.' });
      } else {
        res.status(404).json({ error: 'User not found.' });
      }
    } catch (error) {
      console.error('Error updating user:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
