// src/components/Logout.js

import React, { useContext } from 'react';
import UserContext from '../context/userContext';

const Logout = () => {
  const { setUser } = useContext(UserContext);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/logout', {
        method: 'GET',
        credentials: 'include', // Küldjük a cookie-kat a szerverrel
      });

      if (response.ok) {
        // Sikeres kijelentkezés, null értéket állítunk be a felhasználói információknál
        setUser(null);
        console.log('Logout successful');
      } else {
        // Sikertelen kijelentkezés, kezelheted a választ itt
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };

  return (
    <div>
      <h2>Logout</h2>
      <button onClick={handleLogout} className="btn btn-danger">
        Logout
      </button>
    </div>
  );
};

export default Logout;