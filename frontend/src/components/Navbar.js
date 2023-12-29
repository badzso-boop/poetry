// src/components/Navbar.js

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../context/userContext';

const Navbar = () => {
  const { user } = useContext(UserContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link to="/" className="navbar-brand">My App</Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              {user ? (
                <span className="navbar-text">
                  Welcome, {user.username}! {/* Itt jelenítjük meg a bejelentkezett felhasználó nevét */}
                </span>
              ) : (
                <Link to="/login" className="nav-link">Login</Link>
              )}
            </li>
            <li className="nav-item">
              <Link to="/register" className="nav-link">Register</Link>
            </li>
            <li className="nav-item">
              <Link to="/logout" className="nav-link">Logout</Link>
            </li>
            <li className="nav-item">
              <Link to="/poems" className="nav-link">Poems</Link>
            </li>
            <li className="nav-item">
              <Link to="/uploadpoem" className="nav-link">Upload Poem</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
