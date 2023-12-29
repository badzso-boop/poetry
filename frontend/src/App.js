// src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Poems from './components/Poems';
import Logout from './components/Logout';
import UploadPoems from './components/UploadPoems';
import UserContext from './context/userContext';

function App() {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <div>
          <Navbar />
          <div className="container mt-5">
            <div className="row">
              <div className="col-md-6">
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/logout" element={<Logout />} />
                  <Route path="/poems" element={<Poems />} />
                  <Route path="/uploadpoem" element={<UploadPoems />} />
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
