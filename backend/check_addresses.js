const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ngo_linkup'
});

// Check table structure
db.query('DESCRIBE addresses', (err, results) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Addresses table structure:');
    console.log(JSON.stringify(results, null, 2));
  }
  
  // Check sample data
  db.query('SELECT * FROM addresses LIMIT 3', (err, data) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('\nSample addresses data:');
      console.log(JSON.stringify(data, null, 2));
    }
    db.end();
  });
}); 