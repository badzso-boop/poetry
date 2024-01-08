const express = require('express');
const router = express.Router();
const pool = require('../db');
const Poem = require('../models/poem');
const Comment = require('../models/comment')
const Like = require('../models/like')

// Egy middleware, ami ellenőrzi, hogy a felhasználó be van-e jelentkezve
const checkAuth = (req, res, next) => {
  console.log(req.session)
  if (req.session && req.session.userId) {
    return next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Get all the comments
router.get('/', async (req, res) => {
    try {
        const [commentRows] = await pool.query(
            'SELECT comments.comment_id, comments.user_id, users.username AS commenter, comments.poem_id, comments.comment_text, comments.date_commented FROM comments INNER JOIN users ON comments.user_id = users.user_id;',
        );
  
        const comments = commentRows.map((commentRow) => new Comment(commentRow.comment_id, commentRow.user_id, commentRow.poem_id, commentRow.comment_text, commentRow.date_commented, commentRow.commenter));

        res.json(comments);
    } catch (error) {
      console.error('Error fetching poems:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST comment to a specific poem
router.post('/:poemId', checkAuth, async (req, res) => {
    const poemId = req.params.poemId;
    const userId = req.session.userId; // Az autentikációs middleware-n keresztül hozzáférünk a bejelentkezett felhasználóhoz
    const { commentText } = req.body;
  
    try {
      // Ellenőrizzük, hogy a vers létezik
      const [poemRows] = await pool.query('SELECT * FROM poems WHERE poem_id = ?', [poemId]);
  
      if (poemRows.length !== 1) {
        return res.status(404).json({ error: 'Poem not found.' });
      }
  
      // Beszúrjuk a kommentet az adatbázisba
      const [result] = await pool.query('INSERT INTO comments (user_id, poem_id, comment_text, date_commented) VALUES (?, ?, ?, NOW())', [userId, poemId, commentText]);
  
      const newCommentId = result.insertId;
  
      // Lehetőség van visszaküldeni a frissen beszúrt komment adatait
      const [commentRows] = await pool.query('SELECT * FROM comments WHERE comment_id = ?', [newCommentId]);
  
      if (commentRows.length === 1) {
        const newComment = commentRows[0];
        res.status(201).json(newComment);
      } else {
        res.status(500).json({ error: 'Failed to retrieve the new comment.' });
      }
    } catch (error) {
      console.error('Error adding comment:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE a specific comment
// only when the right user signed in or the role is admin
router.delete('/:commentId', checkAuth, async (req, res) => {
    const commentId = req.params.commentId;
    const userId = req.session.userId;
    const role = req.session.role;
    
    // console.log(commentId)
    // console.log(req.session.userId + " - " + req.session.role)
    // console.log(userId + " - " + role)

    try {
        //ellenorzes, hogy az adott kommentet azt a felhasznalo hozta-e letre
        const [comment] = await pool.query('SELECT * FROM comments WHERE comment_id = ? AND user_id = ?', [commentId, userId])

        if (comment.length === 1) {
            const [result] = await pool.query('DELETE FROM comments WHERE comment_id = ?', [commentId])

            if (result.affectedRows === 1) {
                res.json({ message: 'Comment deleted successfully.' })
            } else {
                res.status(500).json({ error: 'Failed to delete comment.' });
            }
        }
        else if (role === "admin") {
            const [result] = await pool.query('DELETE FROM comments WHERE comment_id = ?', [commentId])

            if (result.affectedRows === 1) {
                res.json({ message: 'Comment deleted successfully.' })
            } else {
                res.status(500).json({ error: 'Failed to delete comment.' });
            }
        }
        else {
            res.status(404).json({ error: 'Comment not found.' });
        }
    } catch (error) {
        console.error('Error editing a comment:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });   
    }
});

// PUT (update) a specific comment
// only if the logged in user is the author of the comment
router.put('/:commentId', checkAuth, async (req, res) => {
  const commentId = req.params.commentId;
  const { commentText } = req.body;
  
  try {
    // Lekérjük a komment adatait az adatbázisból
    const [commentResult] = await pool.query('SELECT user_id FROM comments WHERE comment_id = ?', [commentId]);
    
    if (commentResult.length === 0) {
      // A komment nem található
      return res.status(404).json({ error: 'Comment not found.' });
    }
    
    const originalUserId = commentResult[0].user_id;
    
    // Ellenőrizzük, hogy a bejelentkezett felhasználó azonos-e a komment eredeti tulajdonosával
    // vagy az admin jogosultságokkal rendelkezik-e
    if (originalUserId !== req.session.userId && req.session.role !== "admin") {
      return res.status(403).json({ error: 'Unauthorized - User does not have permission to edit this comment.' });
    }
    
    // A bejelentkezett felhasználó azonos a komment eredeti tulajdonosával vagy admin, folytathatjuk a szerkesztést
    const [updateResult] = await pool.query(
      'UPDATE comments SET comment_text = ? WHERE comment_id = ?',
      [commentText, commentId]
    );
      
    if (updateResult.affectedRows === 1) {
      res.json({ message: 'Comment updated successfully.' });
    } else {
      res.status(500).json({ error: 'Internal Server Error - Failed to update comment.' });
    }
  } catch (error) {
    console.error('Error updating comment:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET comments from a specific user
router.get('/user/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const [rows] = await pool.query('SELECT * FROM comments WHERE user_id = ?', [userId]);
  
      if (rows.length > 0) {
        res.json(rows);
      } else {
        res.status(404).json({ error: 'Comments not found' });
      }
    } catch (error) {
      console.error('Error fetching user comments:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;