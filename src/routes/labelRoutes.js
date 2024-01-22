// src/routes/poemRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const Poem = require('../models/poem');
const Label = require('../models/label')

// Egy middleware, ami ellenőrzi, hogy a felhasználó be van-e jelentkezve
const checkAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// GET all labels
router.get('/', async (req, res) => {
  try {
    const [labelRows] = await pool.query('SELECT * FROM labels ORDER BY label_id;');
    const labels = labelRows.map((labelRow) => new Label(labelRow.label_id, labelRow.label_name));

    res.json(labels);
  } catch (error) {
    console.error('Error fetching labels:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST a new label
router.post('/', async (req, res) => {
    // Ellenőrizzük, hogy a felhasználó be van-e jelentkezve
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Unauthorized - User not logged in.' });
    }

    // Felhasználó azonosítója
    const userId = req.session.userId;

    // A kérés testéből kiolvassuk a vers adatait
    const { label_name } = req.body;
  
    try {
      const [result] = await pool.query(
        'INSERT INTO labels (label_name) VALUES (?)',
        [label_name]
      );

      const newLabel = new Label(result.insertId, label_name);
      res.status(201).json(newLabel);
    } catch (error) {
      console.error('Error creating poem:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE a label by ID
router.delete('/:labelId', async (req, res) => {
    const labelId = req.params.labelId;

    try {
        // Lekérjük a vers adatait az adatbázisból
        const [labelResults] = await pool.query('SELECT label_id FROM labels WHERE label_id = ?', [labelId]);
        
        if (labelResults.length === 0) {
            // A label nem található
            return res.status(404).json({ error: 'Label not found.' });
        }
        
        // Ellenőrizzük, hogy a bejelentkezett felhasználó azonos-e a vers eredeti tulajdonosával
        if (req.session.role !== "admin") {
            return res.status(403).json({ error: 'Unauthorized - User does not have permission to delete this label.' });
        }

        // Tranzakció indul
        await pool.query('START TRANSACTION');

        try {
            // Először töröljük a labels táblából az adott labelhez tartozó sorokat
            const [result] = await pool.query('DELETE FROM labels WHERE label_id = ?', [labelId]);

            // Tranzakció commit
            await pool.query('COMMIT');

            if (result.affectedRows === 1) {
                res.json({ message: 'Label deleted successfully.' });
            } else {
                res.status(404).json({ error: 'Label not found.' });
            }
        } catch (error) {
            // Tranzakció visszavonása hiba esetén
            await pool.query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        console.error('Error deleting label:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;