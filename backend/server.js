const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
const port = 3000;

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "user",
  password: "user123",
  database: "music",
});

db.connect(err => {
  if (err) throw err;
  console.log("Connected to MySQL database");
});

// API to get tracks
app.get("/tracks", (req, res) => {
  db.query("SELECT * FROM tracks", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.listen(port, () => console.log(`Server running on port ${port}`));