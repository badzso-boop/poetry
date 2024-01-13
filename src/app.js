// src/app.js
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");

const userRoutes = require('./routes/userRoutes');
const poemRoutes = require('./routes/poemRoutes');
const authRoutes = require('./routes/authRoutes');
const commentRoutes = require('./routes/commentRoutes');
const albumRoutes = require('./routes/albumRoutes');
const followRoutes = require('./routes/followRoutes');

const app = express();
const port = 3000;

// Middleware for parsing JSON
app.use(express.json());
app.use(compression());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  }),
);



const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);

const corsOptions = {
  origin: ['http://localhost:3001', 'http://localhost:50410'], // Engedélyezett eredet
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
app.use('/comments', commentRoutes);
app.use('/albums', albumRoutes);
app.use('/follows', followRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});