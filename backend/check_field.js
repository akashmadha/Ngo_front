const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ngo_linkup'
});

db.query('SHOW COLUMNS FROM members_registration_details LIKE "registration_type"', (err, results) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Registration type field structure:');
    console.log(JSON.stringify(results, null, 2));
  }
  db.end();
}); 