// src/routes/poemRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const Poem = require('../models/poem');
const Comment = require('../models/comment')
const Like = require('../models/like')

// Egy middleware, ami ellenőrzi, hogy a felhasználó be van-e jelentkezve
const checkAuth = (req, res, next) => {
    if (req.session && req.session.userId && req.session.role == "admin") {
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
        const [albums] = await pool.query('SELECT * FROM albums');
        
        const albumsWithPoems = await Promise.all(albums.map(async (album) => {
        const [poemsRows] = await pool.query('SELECT * FROM poems WHERE poem_id IN (SELECT poem_id FROM album_poems WHERE album_id = ?)', [album.album_id]);

        const poemIds = poemsRows.map((poem) => poem.poem_id);

        const bigpoems = await Promise.all(poemsRows.map(async (poem) => {
            const [likeRows] = await pool.query(
            'SELECT likes.like_id, likes.user_id, users.username, likes.poem_id, likes.date_liked FROM likes INNER JOIN users ON likes.user_id = users.user_id WHERE likes.poem_id = ?;',
            [poem.poem_id]
            );
            
            const [commentRows] = await pool.query(
            'SELECT comments.comment_id, comments.user_id, users.username AS commenter, comments.poem_id, comments.comment_text, comments.date_commented FROM comments INNER JOIN users ON comments.user_id = users.user_id WHERE comments.poem_id = ?;',
            [poem.poem_id]
            );

            let comments = commentRows.map((commentRow) => new Comment(commentRow.comment_id, commentRow.user_id, commentRow.poem_id, commentRow.comment_text, commentRow.date_commented, commentRow.commenter));
            let likes = likeRows.map((likeRow) => new Like(likeRow.like_id, likeRow.user_id, likeRow.poem_id, likeRow.date_liked, likeRow.username));

            const vers = new Poem(poem.poem_id, poem.title, poem.content, poem.user_id, poem.creation_date, poem.author, likes, comments)

            return vers
        }));

        return {
            album_id: album.album_id,
            title: album.title,
            description: album.description,
            poems: bigpoems
        };
        }));

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