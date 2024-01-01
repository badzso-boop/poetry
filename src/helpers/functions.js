const pool = require('../db');
const express = require('express');

const Poem = require('../models/poem');
const Comment = require('../models/comment')
const Like = require('../models/like')

async function getPoemsByUser(userId) {
    const [poemRows] = await pool.query('SELECT * FROM `poems` WHERE poems.user_id = ?', [userId])
    
    const poems = await Promise.all(poemRows.map(async (poem) => {
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
    }))

    return poems
}

async function getAlbums(albumId) {
    if (albumId === -1) {
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

        return albumsWithPoems
    }
    else {
        const [albums] = await pool.query('SELECT * FROM albums WHERE album_id = ?', [albumId]);
      
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

      return albumsWithPoems
    }
}

async function getAlbumsByUser(userId) {
    const [albums] = await pool.query('SELECT * FROM albums WHERE user_id = ?', [userId]);
      
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

  return albumsWithPoems
}

module.exports = {
    getPoemsByUser,
    getAlbums,
    getAlbumsByUser
}