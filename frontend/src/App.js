// src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Logout from './components/Logout';
import Poems from './components/Poems';
import Albums from './components/Albums';
import Profile from './components/Profile';

import UploadPoems from './components/UploadPoems';
import UploadAlbum from './components/UploadAlbum';

import UserContext from './context/userContext';

function App() {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null)

  return (
    <UserContext.Provider value={{ user, setUser, userId, setUserId }}>
      <Router>
        <div>
          <Navbar />
          <div className="container mt-5">
            <div className="row">
              <div className="col-12">
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/logout" element={<Logout />} />
                  <Route path="/poems" element={<Poems />} />
                  <Route path="/albums" element={<Albums />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/uploadpoem" element={<UploadPoems />} />
                  <Route path="/uploadalbum" element={<UploadAlbum />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
