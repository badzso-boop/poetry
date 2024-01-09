// src/components/Albums.js

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Albums = () => {
  const { albums } = useContext(AppContext);

  return (
    <>
      {albums && albums.length > 0 ? (
        <div>
        <h2>Albums</h2>
        <ul>
          {albums.map((album, index) => (
            <li key={index}>
              <Link to={`/albums/${index}`}>
                    <strong>{album.title}</strong>
              </Link>
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
      ) : (
        <p>az albumok meg toltenek</p>
      ) }
    </>
  );
};

export default Albums;
