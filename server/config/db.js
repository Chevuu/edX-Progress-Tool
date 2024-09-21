const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'vukroot',
  password: 'Aeghe+i1',
  database: 'progress-tool',
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MariaDB:', err);
    return;
  }
  console.log('Connected to MariaDB');
});

module.exports = db;