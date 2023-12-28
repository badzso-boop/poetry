// src/routes/poemRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const Poem = require('../models/poem');

// GET all poems
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM poems');
    const poems = rows.map(row => new Poem(row.poem_id, row.title, row.content, row.user_id, row.creation_date));
    res.json(poems);
  } catch (error) {
    console.error('Error fetching poems:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST a new poem
router.post('/', async (req, res) => {
    // Ellenőrizzük, hogy a felhasználó be van-e jelentkezve
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Unauthorized - User not logged in.' });
    }

    // Felhasználó azonosítója
    const userId = req.session.userId;

    // A kérés testéből kiolvassuk a vers adatait
    const { title, content } = req.body;
  
    try {
      const [result] = await pool.query(
        'INSERT INTO poems (title, content, user_id) VALUES (?, ?, ?)',
        [title, content, userId]
      );
  
      const newPoem = new Poem(result.insertId, title, content, userId, new Date());
      res.status(201).json(newPoem);
    } catch (error) {
      console.error('Error creating poem:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE a poem by ID
router.delete('/:poemId', async (req, res) => {
    const poemId = req.params.poemId;
  
    try {
        // Lekérjük a vers adatait az adatbázisból
        const [poemResult] = await pool.query('SELECT user_id FROM poems WHERE poem_id = ?', [poemId]);
        
        if (poemResult.length === 0) {
            // A vers nem található
            return res.status(404).json({ error: 'Poem not found.' });
        }

        const originalUserId = poemResult[0].user_id;

        // Ellenőrizzük, hogy a bejelentkezett felhasználó azonos-e a vers eredeti tulajdonosával
        if (originalUserId !== req.session.userId) {
            return res.status(403).json({ error: 'Unauthorized - User does not have permission to edit this poem.' });
        }

        const [result] = await pool.query('DELETE FROM poems WHERE poem_id = ?', [poemId]);
  
        if (result.affectedRows === 1) {
            res.json({ message: 'Poem deleted successfully.' });
        } else {
            res.status(404).json({ error: 'Poem not found.' });
        }
    } catch (error) {
        console.error('Error deleting poem:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT (update) a poem by ID
router.put('/:poemId', async (req, res) => {
    const poemId = req.params.poemId;
    const { title, content } = req.body;
  
    try {
      // Lekérjük a vers adatait az adatbázisból
      const [poemResult] = await pool.query('SELECT user_id FROM poems WHERE poem_id = ?', [poemId]);
  
      if (poemResult.length === 0) {
        // A vers nem található
        return res.status(404).json({ error: 'Poem not found.' });
      }
  
      const originalUserId = poemResult[0].user_id;
  
      // Ellenőrizzük, hogy a bejelentkezett felhasználó azonos-e a vers eredeti tulajdonosával
      if (originalUserId !== req.session.userId) {
        return res.status(403).json({ error: 'Unauthorized - User does not have permission to edit this poem.' });
      }
  
      // A bejelentkezett felhasználó azonos a vers eredeti tulajdonosával, folytathatjuk a szerkesztést
      const [updateResult] = await pool.query(
        'UPDATE poems SET title = ?, content = ? WHERE poem_id = ?',
        [title, content, poemId]
      );
  
      if (updateResult.affectedRows === 1) {
        res.json({ message: 'Poem updated successfully.' });
      } else {
        res.status(500).json({ error: 'Internal Server Error - Failed to update poem.' });
      }
    } catch (error) {
      console.error('Error updating poem:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;
