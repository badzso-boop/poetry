// src/routes/poemRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const Poem = require('../models/poem');
const Comment = require('../models/comment')
const Like = require('../models/like')

// Egy middleware, ami ellenőrzi, hogy a felhasználó be van-e jelentkezve
const checkAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// GET all poems
router.get('/', async (req, res) => {
  try {
    const [poemRows] = await pool.query(
      'SELECT poems.*, users.username AS author FROM poems JOIN users ON poems.user_id = users.user_id'
    );

    const poems = poemRows.map(async (row) => {
      const [likeRows] = await pool.query(
        'SELECT likes.like_id, likes.user_id, users.username, likes.poem_id, likes.date_liked FROM likes INNER JOIN users ON likes.user_id = users.user_id WHERE likes.poem_id = ?;',
        [row.poem_id]
      );

      const [commentRows] = await pool.query(
        'SELECT comments.comment_id, comments.user_id, users.username AS commenter, comments.poem_id, comments.comment_text, comments.date_commented FROM comments INNER JOIN users ON comments.user_id = users.user_id WHERE comments.poem_id = ?;',
        [row.poem_id]
      );


      const comments = commentRows.map((commentRow) => new Comment(commentRow.comment_id, commentRow.user_id, commentRow.poem_id, commentRow.comment_text, commentRow.date_commented, commentRow.commenter));
      const likes = likeRows.map((likeRow) => new Like(likeRow.like_id, likeRow.user_id, likeRow.poem_id, likeRow.date_liked, likeRow.username));
      const likeDb = likeRows.length;

      return new Poem(row.poem_id, row.title, row.content, row.user_id, row.creation_date, row.author, likes, likeDb, comments);
    });

    const poemsWithLikesComments = await Promise.all(poems);

    res.json(poemsWithLikesComments);
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

// GET poems from a specific user
router.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const [rows] = await pool.query('SELECT * FROM poems WHERE user_id = ?', [userId]);

    if (rows.length > 0) {
       res.json(rows);
    } else {
      res.status(404).json({ error: 'Poems not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET a specific poem
router.get('/poem/:poemId', async (req, res) => {
  const poemId = req.params.poemId;
  
  try {
    const [poemRrows] = await pool.query('SELECT poems.*, users.username AS author FROM poems JOIN users ON poems.user_id = users.user_id WHERE poems.poem_id = ?;', [poemId]);
    
    if (poemRrows.length === 1) {
      const [likeRows] = await pool.query(
        'SELECT likes.like_id, likes.user_id, users.username, likes.poem_id, likes.date_liked FROM likes INNER JOIN users ON likes.user_id = users.user_id WHERE likes.poem_id = ?;',
        [poemId]
        );
        
        const [commentRows] = await pool.query(
          'SELECT comments.comment_id, comments.user_id, users.username AS commenter, comments.poem_id, comments.comment_text, comments.date_commented FROM comments INNER JOIN users ON comments.user_id = users.user_id WHERE comments.poem_id = ?;',
          [poemId]
          );
          
      const comments = commentRows.map((commentRow) => new Comment(commentRow.comment_id, commentRow.user_id, commentRow.poem_id, commentRow.comment_text, commentRow.date_commented, commentRow.commenter));
      const likes = likeRows.map((likeRow) => new Like(likeRow.like_id, likeRow.user_id, likeRow.poem_id, likeRow.date_liked, likeRow.username));
      
      const poem = new Poem(poemRrows[0].poem_id, poemRrows[0].title, poemRrows[0].content, poemRrows[0].user_id, poemRrows[0].creation_date, poemRrows[0].author, likes, comments);
      
      res.json(poem);
    } else {
      res.status(404).json({ error: 'Poem not found' });
    }
  } catch (error) {
    console.error('Error fetching poem:', error.message);
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

    // Tranzakció indul
    await pool.query('START TRANSACTION');

    try {
      // Először töröljük a likes táblából az adott vershez tartozó sorokat
      await pool.query('DELETE FROM likes WHERE poem_id = ?', [poemId]);

      // Majd a comments táblából is töröljük az adott vershez tartozó sorokat
      await pool.query('DELETE FROM comments WHERE poem_id = ?', [poemId]);

      // Végül töröljük a poems táblából az adott verset
      const [result] = await pool.query('DELETE FROM poems WHERE poem_id = ?', [poemId]);

      // Tranzakció commit
      await pool.query('COMMIT');

      if (result.affectedRows === 1) {
        res.json({ message: 'Poem deleted successfully.' });
      } else {
        res.status(404).json({ error: 'Poem not found.' });
      }
    } catch (error) {
      // Tranzakció visszavonása hiba esetén
      await pool.query('ROLLBACK');
      throw error;
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

// POST like to a specific poem
router.post('/like/:poemId', checkAuth, async (req, res) => {
  const userId = req.session.userId;
  const poemId = req.params.poemId;

  try {
    // Ellenőrzés, hogy a felhasználó már likeolta-e a verset
    const [existingLikes] = await pool.query('SELECT * FROM likes WHERE user_id = ? AND poem_id = ?', [userId, poemId]);

    if (existingLikes.length === 0) {
      // Ha még nem likeolta meg, akkor hozzáadja a like-ot
      await pool.query('INSERT INTO likes (user_id, poem_id) VALUES (?, ?)', [userId, poemId]);
      res.json({ message: 'Poem liked successfully.' });
    } else {
      // Ha már likeolta, akkor törölje a like-ot
      await pool.query('DELETE FROM likes WHERE user_id = ? AND poem_id = ?', [userId, poemId]);
      res.json({ message: 'Poem like removed successfully.' });
    }
  } catch (error) {
    console.error('Error handling poem like:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;