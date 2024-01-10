import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Poem = (() => {
    const { poemId } = useParams();
    const { poems } = useContext(AppContext);

    const poem = poems[poemId]

    const renderContentWithLineBreaks = () => {
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
          {poem && poems.length > 0 ? (
            <>
              <strong>{poem.title}</strong>
              <p>{renderContentWithLineBreaks()}</p>
              <strong>{poem.author}</strong>
              <p>{poem.creationDate}</p>
              <span>
                <strong>Likeok: </strong> {poem.likeDb} db
              </span>
              <ul>
                {poem.likes.map((like, index) => (
                  <li key={index}>{like.username}</li>
                ))}
              </ul>
              <span>
                <strong>Kommentek:</strong> {poem.comments.length} db
              </span>
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
            </>
          ) : (
            <p>A vers még nem töltődtek be.</p>
          )}
        </>
      );
})

export default Poem;