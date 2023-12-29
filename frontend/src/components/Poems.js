// src/components/Poems.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Poems = () => {
  const [poems, setPoems] = useState([]);

  useEffect(() => {
    const fetchPoems = async () => {
      try {
        const response = await axios.get('http://localhost:3000/poems', { withCredentials: true });
        setPoems(response.data);
      } catch (error) {
        console.error('Error fetching poems:', error.message);
      }
    };

    fetchPoems();

  }, []);

  return (
    <div>
      <h2>Poems</h2>
      <ul>
        {poems.map((poem, index) => (
          <li key={index}>
            <strong>{poem.title}</strong>
            <p>{poem.content}</p>
            <strong>{poem.author}</strong>
            <p>{poem.creationDate}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Poems;
