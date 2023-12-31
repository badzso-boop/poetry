const express = require('express');
const router = express.Router();
const pool = require('../db');
const User = require('../models/user');

// Egy middleware, ami ellenőrzi, hogy a felhasználó be van-e jelentkezve
const checkAuth = (req, res, next) => {
    if (req.session && req.session.userId && req.session.role == "admin") {
      return next();
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
};

// GET all users followed by a user
router.get('/following/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        // Ellenőrizzük, hogy a felhasználó létezik
        const [userRows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [userId]);

        if (userRows.length !== 1) {
        return res.status(404).json({ error: 'User not found.' });
        }

        // Lekérdezzük az összes követett felhasználót az adatbázisból
        const [followingRows] = await pool.query('SELECT follows.followed_id, users.username FROM follows JOIN users ON follows.followed_id = users.user_id WHERE follows.follower_id = ?', [userId]);

        const following = followingRows.map(row => ({ userId: row.followed_id, username: row.username }));

        res.json(following);
    } catch (error) {
        console.error('Error fetching following users:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
  
// GET all followers of a user
router.get('/followers/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        // Ellenőrizzük, hogy a felhasználó létezik
        const [userRows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [userId]);

        if (userRows.length !== 1) {
        return res.status(404).json({ error: 'User not found.' });
        }

        // Lekérdezzük az összes követőt az adatbázisból
        const [followerRows] = await pool.query('SELECT follows.follower_id, users.username FROM follows JOIN users ON follows.follower_id = users.user_id WHERE follows.followed_id = ?', [userId]);

        const followers = followerRows.map(row => ({ userId: row.follower_id, username: row.username }));

        res.json(followers);
    } catch (error) {
        console.error('Error fetching followers:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
  
// POST follow a user
router.post('/follow/:followedId', checkAuth, async (req, res) => {
    const followerId = req.session.userId;
    const followedId = req.params.followedId;  

    try {
        // Ellenőrizzük, hogy a követett felhasználó létezik
        const [userRows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [followedId]);

        if (userRows.length !== 1) {
        return res.status(404).json({ error: 'User not found.' });
        }

        // Ellenőrizzük, hogy a felhasználó ne követhesse önmagát
        if (String(followerId) === String(followedId)) {
        return res.status(400).json({ error: 'You cannot follow yourself.' });
        }

        // Ellenőrizzük, hogy a felhasználó már követi-e a másik felhasználót
        const [existingFollowRows] = await pool.query('SELECT * FROM follows WHERE follower_id = ? AND followed_id = ?', [followerId, followedId]);

        if (existingFollowRows.length > 0) {
        return res.status(400).json({ error: 'You are already following this user.' });
        }

        // Hozzáadjuk a követést az adatbázishoz
        const [result] = await pool.query('INSERT INTO follows (follower_id, followed_id, date_followed) VALUES (?, ?, NOW())', [followerId, followedId]);

        if (result.affectedRows === 1) {
        res.json({ message: 'Follow successful.' });
        } else {
        res.status(500).json({ error: 'Failed to follow user.' });
        }
    } catch (error) {
        console.error('Error following user:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
  
// DELETE unfollow a user
router.delete('/unfollow/:followedId', checkAuth, async (req, res) => {
    const followerId = req.session.userId;
    const followedId = req.params.followedId;

    try {
    // Ellenőrizzük, hogy a követett felhasználó létezik
    const [userRows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [followedId]);

    if (userRows.length !== 1) {
        return res.status(404).json({ error: 'User not found.' });
    }

    // Ellenőrizzük, hogy a felhasználó ne követhesse ki önmagát
    if (String(followerId) === String(followedId)) {
        return res.status(400).json({ error: 'You cannot unfollow yourself.' });
    }

    // Ellenőrizzük, hogy a felhasználó már követi-e a másik felhasználót
    const [existingFollowRows] = await pool.query('SELECT * FROM follows WHERE follower_id = ? AND followed_id = ?', [followerId, followedId]);

    if (existingFollowRows.length === 0) {
        return res.status(400).json({ error: 'You are not following this user.' });
    }

    // Töröljük a követést az adatbázisból
    const [result] = await pool.query('DELETE FROM follows WHERE follower_id = ? AND followed_id = ?', [followerId, followedId]);

    if (result.affectedRows === 1) {
        res.json({ message: 'Unfollow successful.' });
    } else {
        res.status(500).json({ error: 'Failed to unfollow user.' });
    }
    } catch (error) {
    console.error('Error unfollowing user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;