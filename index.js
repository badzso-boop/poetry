const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// MySQL kapcsolat beállítása
const connection = mysql.createConnection({
  host: 'localhost', // MySQL szerver címe
  user: 'root', // MySQL felhasználónév
  password: '', // MySQL jelszó
  database: 'poetry', // Adatbázis neve
});

// MySQL kapcsolat megnyitása
connection.connect((err) => {
  if (err) {
    console.error('Hiba a MySQL kapcsolatban: ' + err.stack);
    return;
  }
  console.log('Sikeres MySQL kapcsolat, id: ' + connection.threadId);
});

// Express.js útvonal adataink lekérdezéséhez
app.get('/', (req, res) => {
  // Példa SQL lekérdezés: minden adat lekérdezése a 'tabla_neve' táblából
  const sqlQuery = 'SELECT * FROM poems';

  // MySQL lekérdezés végrehajtása
  connection.query(sqlQuery, (error, results) => {
    if (error) {
      console.error('Hiba a lekérdezés során: ' + error.message);
      res.status(500).json({ error: 'Hiba a lekérdezés során' });
      return;
    }

    // Lekérdezett adatok visszaküldése a kliensnek
    res.json(results);
  });
});

// Express.js szerver indítása
app.listen(port, () => {
  console.log(`Az Express.js szerver fut a http://localhost:${port} címen`);
});
