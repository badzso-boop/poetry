// src/db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Nyertes14!',
  database: 'poetry',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port: 3309
});

module.exports = pool.promise();