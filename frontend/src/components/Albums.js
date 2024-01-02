// src/components/Albums.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Albums = () => {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axios.get('http://localhost:3000/albums/albums-with-poems', { withCredentials: true });
        setAlbums(response.data);
      } catch (error) {
        console.error('Error fetching albums:', error.message);
      }
    };

    fetchAlbums();

  }, []);

  return (
    <div>
      <h2>Albums</h2>
      <ul>
        {albums.map((album, index) => (
          <li key={index}>
            <strong>{album.title}</strong>
            <p>{album.description}</p>
            <ul>
              {album.poems.map((poem, index) => (
                <li key={index}>
                  <strong>{poem.title}</strong>
                  <p>{poem.content}</p>
                  <strong>{poem.author}</strong>
                  <p>{poem.creationDate}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Albums;
