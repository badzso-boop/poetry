// src/components/Profile.js

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from '../context/AppContext';

const Profile = () => {
  const [users, setUsers] = useState([]);
  const [poemId, setPoemId] = useState("");
  const [commentId, setCommentId] = useState("");
  const [editingStateComment, setEditingStateComment] = useState({});
  const [error, setError] = useState(null);
  const [editingState, setEditingState] = useState({});

  const { user, userId, setUser } = useContext(AppContext);

  const handleDelete = async (event) => {
    event.preventDefault();

    try {
      // Az input mező értéke alapján állítsa be a poemId-t
      const poemIdToDelete = event.target.elements.poemId.value;

      // Axios DELETE kérés küldése a megadott poemId-vel
      await axios.delete(`http://localhost:3000/poems/${poemIdToDelete}`, {
        withCredentials: true,
      });

      // Sikeres törlés esetén további műveletek, pl. frissítés vagy visszajelzés
      console.log(`A költemény (${poemIdToDelete}) sikeresen törölve!`);
      setPoemId(poemIdToDelete);
    } catch (error) {
      // Hiba esetén kezelés, pl. hibaüzenet megjelenítése
      console.error("Hiba történt a törlés során:", error);
    }
  };

  const handleEditSubmit = async (poemId, event) => {
    event.preventDefault();

    try {
      const editedPoemData = editingState[poemId]?.editedPoem;

      if (!editedPoemData) {
        console.error("Nincs frissített vers adat.");
        return;
      }

      // Az editedPoem állapotot használhatod a frissített adatok elküldéséhez
      await axios.put(`http://localhost:3000/poems/${poemId}`, editedPoemData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Sikeres módosítás esetén további műveletek, pl. frissítés vagy visszajelzés
      console.log(`A költemény (${poemId}) sikeresen módosítva!`);

      // Frissítjük a state-et és leállítjuk a szerkesztés módot
      setEditingState((prevEditingState) => ({
        ...prevEditingState,
        [poemId]: {
          editing: false,
          editedPoem: {
            title: "",
            content: "",
          },
        },
      }));
    } catch (error) {
      // Hiba esetén kezelés, pl. hibaüzenet megjelenítése
      console.error("Hiba történt a módosítás során:", error);
    }
  };

  const handleEditClick = (poemId, poem) => {
    // Az adott vers egyedi azonosítója alapján állítsuk be az editingState-et
    setEditingState((prevEditingState) => ({
      ...prevEditingState,
      [poemId]: {
        editing: true,
        editedPoem: {
          title: poem.title,
          content: poem.content,
        },
      },
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const poemId = e.target.closest("li").dataset.poemid;

    setEditingState((prevEditingState) => ({
      ...prevEditingState,
      [poemId]: {
        ...prevEditingState[poemId],
        editedPoem: {
          ...prevEditingState[poemId]?.editedPoem,
          [name]: value,
        },
      },
    }));
  };

  const handleDeleteClickComment = async (commentId) => {
    try {
      // Az input mező értéke alapján állítsa be a poemId-t
      const commentIdToDelete = commentId;

      // Axios DELETE kérés küldése a megadott poemId-vel
      await axios.delete(
        `http://localhost:3000/comments/${commentIdToDelete}`,
        {
          withCredentials: true,
        }
      );

      // Sikeres törlés esetén további műveletek, pl. frissítés vagy visszajelzés
      console.log(`A komment (${commentIdToDelete}) sikeresen törölve!`);
      setCommentId(commentIdToDelete);
    } catch (error) {
      // Hiba esetén kezelés, pl. hibaüzenet megjelenítése
      console.error("Hiba történt a törlés során:", error);
    }
  };

  const handleEditClickComment = (commentId, comment) => {
    console.log(comment.commentText);
    setEditingStateComment((prevEditingStateComment) => ({
      ...prevEditingStateComment,
      [commentId]: {
        editing: true,
        editedComment: {
          commentText: comment.commentText,
        },
      },
    }));
  };

  const handleInputChangeComment = (e) => {
    const { name, value } = e.target;
    const commentId = e.target.closest("li").dataset.commentid;
    console.log(commentId)

    setEditingStateComment((prevEditingStateComment) => ({
      ...prevEditingStateComment,
      [commentId]: {
        ...prevEditingStateComment[commentId],
        editedComment: {
          ...prevEditingStateComment[commentId]?.editedComment,
          [name]: value,
        },
      },
    }));
  };

  const handleEditSubmitComment = async (commentId, event) => {
    event.preventDefault();

    try {
      const editedCommentData = editingStateComment[commentId]?.editedComment;

      if (!editedCommentData) {
        console.error("Nincs frissített vers adat.");
        return;
      }

      // Az editedPoem állapotot használhatod a frissített adatok elküldéséhez
      await axios.put(
        `http://localhost:3000/comments/${commentId}`,
        editedCommentData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Sikeres módosítás esetén további műveletek, pl. frissítés vagy visszajelzés
      console.log(`A költemény (${commentId}) sikeresen módosítva!`);

      // Frissítjük a state-et és leállítjuk a szerkesztés módot
      setEditingStateComment((prevEditingStateComment) => ({
        ...prevEditingStateComment,
        [commentId]: {
          editing: false,
          editedComment: {
            commentText: "",
          },
        },
      }));
    } catch (error) {
      // Hiba esetén kezelés, pl. hibaüzenet megjelenítése
      console.error("Hiba történt a módosítás során:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Elkérjük a user ID-t a session-ből
        const userid = userId;

        // Ha nincs bejelentkezve a felhasználó, ne küldjük el a kérést
        if (!user || !user.username) {
          setError("Not logged in");
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/users/${userid}`,
          { withCredentials: true }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching poems:", error.message);
        setError("Error fetching poems");
      }
    };

    fetchUser();
  }, [poemId, editingState, commentId, editingStateComment]);

  console.log(user)

  return (
    user && (
      <div>
        {/* <!-- Felhasználói adatok --> */}
        <div className="col-12 mb-4">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">{user.username}</h4>
              <p className="card-text">E-mail cím: {user.email}</p>
              <p className="card-text">Profil kép: {user.profileImgUrl}</p>
              <p className="card-text">Rang: {user.role}</p>
            </div>
          </div>
        </div>

        {/* <!-- Verseket tartalmazó bal oszlop --> */}
        <div className="container">
          <div className="row">
            <div className="col-6">
              <h2>Összes Vers</h2>
              <ul className="list-group">
                {user.poems &&
                  user.poems.map((poem, index) => (
                    <li
                      key={index}
                      className="list-group-item"
                      data-poemid={poem.id}
                    >
                      <strong>{poem.title}</strong>
                      <p>{poem.content}</p>
                      <strong>{poem.author}</strong>
                      <p>{poem.creationDate}</p>

                      <form onSubmit={handleDelete}>
                        <label>
                          <input
                            type="text"
                            name="poemId"
                            value={poem.id}
                            style={{ display: "none" }}
                            readOnly
                          />
                        </label>
                        <button type="submit">Vers törlése</button>
                      </form>

                      {editingState[poem.id]?.editing ? (
                        // Szerkesztő űrlap
                        <form onSubmit={(e) => handleEditSubmit(poem.id, e)}>
                          <label>
                            Title:
                            <input
                              type="text"
                              name="title"
                              value={
                                editingState[poem.id]?.editedPoem.title || ""
                              }
                              onChange={handleInputChange}
                            />
                          </label>
                          <label>
                            Content:
                            <input
                              type="text"
                              name="content"
                              value={
                                editingState[poem.id]?.editedPoem.content || ""
                              }
                              onChange={handleInputChange}
                            />
                          </label>
                          <button type="submit">Vers Szerkesztése</button>
                        </form>
                      ) : (
                        // Szerkesztő gomb
                        <button onClick={() => handleEditClick(poem.id, poem)}>
                          Vers szerkesztése
                        </button>
                      )}

                      <br />
                      <strong>Likeok</strong>
                      <ul>
                        {poem.likes.map((like, index) => (
                          <li key={index}>{like.username}</li>
                        ))}
                      </ul>
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title">Kommentek</h5>
                          <ul className="list-group">
                            {poem.comments && poem.comments.map((comment, index) => (
                              <li
                                key={index}
                                className="list-group-item"
                                data-commentid={comment.id}
                              >
                                {comment.commenter}: {comment.commentText} (
                                {comment.dateCommented})
                                {editingStateComment[comment.id]?.editing ? (
                                  <div>
                                    <form
                                      onSubmit={(e) =>
                                        handleEditSubmitComment(comment.id, e)
                                      }
                                    >
                                      <label>
                                        Comment text:
                                        <input
                                          type="text"
                                          name="commentText"
                                          value={
                                            editingStateComment[comment.id]
                                              ?.editedComment.commentText || ""
                                          }
                                          onChange={handleInputChangeComment}
                                        />
                                      </label>
                                      <button type="submit">
                                        Komment mentése
                                      </button>
                                    </form>
                                  </div>
                                ) : (
                                  <div>
                                    <button
                                      onClick={() =>
                                        handleEditClickComment(
                                          comment.id,
                                          comment
                                        )
                                      }
                                    >
                                      Komment szerkesztése
                                    </button>
                                  </div>
                                )}
                                <button
                                  onClick={() =>
                                    handleDeleteClickComment(comment.id)
                                  }
                                >
                                  Komment törlése
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>

            {/* <!-- Albumokat tartalmazó jobb oszlop --> */}
            <div className="col-6">
              <h2>Albumok</h2>
              {user.albums &&
                user.albums[0].map((album, index) => (
                  <div key={index} className="card m-3">
                    <div className="card-body">
                      <h5 className="card-title">{album.title}</h5>
                      <p className="card-text">{album.desciption}</p>
                      <ul className="list-group">
                        {album.poems.map((poem, index) => (
                          <li key={index} className="list-group-item">
                            <strong>{poem.title}</strong>
                            <p>{poem.content}</p>
                            <strong>{poem.author}</strong>
                            <p>{poem.creationDate}</p>
                            <strong>Likeok</strong>
                            <ul>
                              {poem.likes.map((like, index) => (
                                <li key={index}>{like.username}</li>
                              ))}
                            </ul>
                            <div className="card">
                              <div className="card-body">
                                <h5 className="card-title">Kommentek</h5>
                                <ul className="list-group">
                                  {poem.comments.map((comment, index) => (
                                    <li key={index} className="list-group-item">
                                      {comment.commenter}: {comment.commentText}{" "}
                                      ({comment.dateCommented})
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Profile;
