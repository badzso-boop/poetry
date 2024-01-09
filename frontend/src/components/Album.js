import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Poem = (() => {
    const { albumId } = useParams();
    const { albums } = useContext(AppContext);
    
    const album = albums[albumId]

    return (
        <>
        {albums && albums.length > 0 ? 
        (
            <>
                <ul>
                    <li>
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
                </ul>
            </>
        )
        :(
            <p>az album még nem töltődött be</p>
        )}
        </>
      );
})

export default Poem;