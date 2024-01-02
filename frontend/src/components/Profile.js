// src/components/Profile.js

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import UserContext from '../context/userContext';

const Profile = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const { user, userId } = useContext(UserContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Elkérjük a user ID-t a session-ből
        const userid = userId;

        // Ha nincs bejelentkezve a felhasználó, ne küldjük el a kérést
        if (!user || !user.username) {
          setError('Not logged in');
          return;
        }

        const response = await axios.get(`http://localhost:3000/users/${userid}`, { withCredentials: true });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching poems:', error.message);
        setError('Error fetching poems');
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
        {/* <!-- Felhasználói adatok --> */}
        <div class="col-lg-4 mb-4">
            <div class="card">
                <div class="card-body">
                <h4 class="card-title">{users.username}</h4>
                <p class="card-text">E-mail cím: {users.email}</p>
                <p class="card-text">Profil kép: {users.profileImgUrl}</p>
                <p class="card-text">Rang: {users.role}</p>
                </div>
            </div>
        </div>
        
        {/* <!-- Verseket tartalmazó bal oszlop --> */}
        <div class="container">
            <div class="row">
                <div class="col">
                    <h2>Összes Vers</h2>
                    <ul class="list-group">
                        {users.poems && users.poems.map((poem, index) => (
                            <li key={index} class="list-group-item">
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
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Kommentek</h5>
                                        <ul class="list-group">
                                            {poem.comments.map((comment, index) => (
                                                <li key={index} class="list-group-item">{comment.commenter}: {comment.commentText} ({comment.dateCommented})</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
        
                {/* <!-- Albumokat tartalmazó jobb oszlop --> */}
                <div class="col">
                    <h2>Albumok</h2>
                    {users.albums && users.albums[0].map((album, index) => (
                        <div key={index} class="card m-3">
                            <div class="card-body">
                                <h5 class="card-title">{album.title}</h5>
                                <p class="card-text">{album.desciption}</p>
                                <ul class="list-group">
                                    {album.poems.map((poem, index) => (
                                        <li key={index} class="list-group-item">
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
                                            <div class="card">
                                                <div class="card-body">
                                                    <h5 class="card-title">Kommentek</h5>
                                                    <ul class="list-group">
                                                        {poem.comments.map((comment, index) => (
                                                            <li key={index} class="list-group-item">{comment.commenter}: {comment.commentText} ({comment.dateCommented})</li>
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
  );
};

export default Profile;
