// src/components/Poems.js

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { AppContext } from '../context/AppContext';

const Poems = () => {
  const { poems } = useContext(AppContext);

  const renderContentWithLineBreaks = (poem) => {
    if (!poem) return null;

    const contentWithBreaks = poem.content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));

    return contentWithBreaks;
  };

  return (
    <>
      {poems && poems.length > 0 ? (
        <>
          <div>
            <h2>Poems</h2>
            <ul>
              {poems.map((poem, index) => (
                <li key={index}>
                  <Link to={`/poems/${index}`}>
                    <strong>{poem.title}</strong>
                  </Link>
                  <p>{renderContentWithLineBreaks(poem)}</p>
                  <strong>{poem.author}</strong>
                  <p>{poem.creationDate}</p>
                  <span><strong>Likeok: </strong> {poem.likeDb} db</span>
                  <ul>
                    {poem.likes.map((like, index) => (
                      <li key={index}>{like.username}</li>
                    ))}
                  </ul>
                  <span><strong>Kommentek:</strong> {poem.comments.length} db</span>
                  <ul className="list-group">
                    {poem.comments.map((comment, index) => (
                      <li
                        key={index}
                        className="list-group-item"
                        data-commentid={comment.id}
                      >
                        {comment.commenter}: {comment.commentText} (
                        {comment.dateCommented})
                        
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <>
          <p>A versek meg nem toltottek be</p>
        </>
      )}
    </>
  );
};

export default Poems;
