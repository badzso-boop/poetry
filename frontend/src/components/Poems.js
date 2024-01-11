// src/components/Poems.js

import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import { AppContext } from '../context/AppContext';

const Poems = () => {
  const { poems } = useContext(AppContext);
  const [showcomment, setShowComment] = useState(false);
  const [selectedPoemIndex, setSelectedPoemIndex] = useState(null); // Új állapot

  const handleToggleComments = (index) => {
    setShowComment(!showcomment);
    setSelectedPoemIndex(index);
  };

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
            <h1 className="text-center">Poems</h1>
            <ul className="list-unstyled">
              {poems.map((poem, index) => (
                <li key={index}>
                  <div className="card m-4">
                    <div className="card-header">
                      <Link to={`/poems/${index}`}>
                        <strong>{poem.title}</strong>
                      </Link>
                    </div>
                    <div className="card-body">
                      <blockquote>
                        <p>{renderContentWithLineBreaks(poem)}</p>
                        <footer className="blockquote-footer">
                          <cite>
                            <strong>{poem.author}</strong>
                            <p>{poem.creationDate.split("T")[0]}</p>
                          </cite>
                        </footer>
                      </blockquote>

                      <span><strong>Kommentek:</strong> {poem.comments.length} db</span>
                      {poem.comments.length > 0 ? (
                        <>
                          <button
                            className="btn btn-link"
                            onClick={() => handleToggleComments(index)}
                          >
                            {selectedPoemIndex === index && showcomment
                              ? 'Elrejtés'
                              : 'Megjelenítés'}
                          </button>
                          {selectedPoemIndex === index && showcomment
                              ? (
                                <ul className="list-group list-group-flush mb-4">
                                {poem.comments.map((comment, index) => (
                                  <li
                                    key={index}
                                    className="list-group-item"
                                    data-commentid={comment.id}
                                  >
                                    <div className="card">
                                      <div className="card-header d-flex justify-content-between">
                                        <p className="text-left mb-0">{comment.commenter}</p>
                                        <p className="text-right mb-0">{comment.dateCommented.split("T")[0]}</p>
                                      </div>
                                      <div className="card-body">
                                        <p className="card-text">
                                          {comment.commentText}
                                        </p>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>  
                            ) : (
                              <>
                                <br />
                              </>  
                            )}
                        </>
                      ) : (
                        <>
                          <br />
                        </>
                      )}


                      <span><strong>Likeok: </strong> {poem.likeDb} db</span>
                      {/* <ul>
                        {poem.likes.map((like, index) => (
                          <li key={index}>{like.username}</li>
                        ))}
                      </ul> */}
                    </div>
                  </div>
                  
                  
                  
                  
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
