// src/routes/poemRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const Poem = require('../models/poem');
const Comment = require('../models/comment')
const Like = require('../models/like')

const Functions = require('../helpers/functions');

// Egy middleware, ami ellenőrzi, hogy a felhasználó be van-e jelentkezve
const checkAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
      return next();
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
};

// POST: Create album and add poems to it
router.post('/create-album', async (req, res) => {
    const { title, description, poemIds } = req.body;
    const userId = req.session.userId; // A felhasználó azonosítója, aki létrehozza az albumot
  
    try {
      // Ellenőrizzük, hogy az adott felhasználó létezik
      const [userRows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [userId]);
  
      if (userRows.length !== 1) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // Létrehozzuk az albumot
      const [albumResult] = await pool.query('INSERT INTO albums (user_id, title, description) VALUES (?, ?, ?)', [userId, title, description]);
  
      if (albumResult.affectedRows !== 1) {
        return res.status(500).json({ error: 'Failed to create album.' });
      }
  
      const albumId = albumResult.insertId;
  
      // Hozzáadjuk a kapcsolatot az album_poems táblához
      for (const poemId of poemIds) {
        await pool.query('INSERT INTO album_poems (album_id, poem_id) VALUES (?, ?)', [albumId, poemId]);
      }
  
      res.json({ message: 'Album created successfully.' });
    } catch (error) {
      console.error('Error creating album:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});
  
// GET all albums with poems
router.get('/albums-with-poems', async (req, res) => {
    try {
        const albumsWithPoems = await Functions.getAlbums(-1)

        res.json(albumsWithPoems);
    } catch (error) {
        console.error('Error fetching albums with poems:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET a specific album with poems by id
router.get('/albums-with-poems/:albumId', async (req, res) => {
  const albumId = req.params.albumId
  try {
      const albumsWithPoems = await Functions.getAlbums(albumId)

      res.json(albumsWithPoems);
  } catch (error) {
      console.error('Error fetching albums with poems:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


// DELETE album by album_id
router.delete('/delete-album/:albumId', checkAuth, async (req, res) => {
    const albumId = req.params.albumId;
    const userId = req.session.userId;

    try {
        // Ellenőrizzük, hogy az adott felhasználó létezik
        const [userRows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [userId]);

        if (userRows.length !== 1) {
          return res.status(404).json({ error: 'User not found.' });
        }

        // Ellenőrizzük, hogy a felhasználó a tulajdonosa-e az albumnak
        const [albumRows] = await pool.query('SELECT * FROM albums WHERE album_id = ? AND user_id = ?', [albumId, userId]);

        if (albumRows.length !== 1) {
        return res.status(403).json({ error: 'Unauthorized - User does not have permission to delete this album.' });
        }

        // Törlés az albums táblából
        const [deleteAlbumResult] = await pool.query('DELETE FROM albums WHERE album_id = ?', [albumId]);

        // Ellenőrizzük, hogy történt-e törlés
        if (deleteAlbumResult.affectedRows !== 1) {
        return res.status(404).json({ error: 'Album not found.' });
        }

        // Törlés az album_poems táblából
        const [deleteAlbumPoemsResult] = await pool.query('DELETE FROM album_poems WHERE album_id = ?', [albumId]);

        // Ellenőrizzük, hogy történt-e törlés
        if (deleteAlbumPoemsResult.affectedRows >= 0) {
        res.json({ message: 'Album deleted successfully.' });
        } else {
        res.status(500).json({ error: 'Failed to delete album from album_poems table.' });
        }
    } catch (error) {
        console.error('Error deleting album:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;