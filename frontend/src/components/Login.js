// src/components/Login.js

import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

const Login = () => {
  const { setUser, setUserId } = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const requestBody = {
        username: username,
        password: password,
      };

      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        credentials: 'include', // Küldjük a cookie-kat a szerverrel
      });

      if (response.ok) {
        // Sikeres bejelentkezés, kezelheted a választ itt
        const responseData = await response.json();
        const userId = responseData.userId;
        setUser({ username: username });
        setUserId(userId)
        console.log('Successful login');
      } else {
        // Sikertelen bejelentkezés, kezelheted a választ itt
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
