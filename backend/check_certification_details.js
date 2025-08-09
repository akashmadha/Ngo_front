const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ngo_linkup'
});

// Check table structure
db.query('DESCRIBE certification_details', (err, results) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Certification details table structure:');
    console.log(JSON.stringify(results, null, 2));
  }
  
  // Check sample data
  db.query('SELECT * FROM certification_details LIMIT 3', (err, data) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('\nSample certification_details data:');
      console.log(JSON.stringify(data, null, 2));
    }
    db.end();
  });
}); 