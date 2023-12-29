// src/app.js
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const poemRoutes = require('./routes/poemRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = 3000;

// Middleware for parsing JSON
app.use(express.json());


const corsOptions = {
    origin: 'http://localhost:3001', // Engedélyezett eredet
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Engedélyezd a cookie-k elküldését
  };
  
  app.use(cors(corsOptions));

// Session middleware
app.use(session({
    secret: 'your-secret-key', // Titkos kulcs a session-ök titkosításához
    resave: false,
    saveUninitialized: true
}));



// Routes
app.use('/users', userRoutes);
app.use('/poems', poemRoutes);
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});