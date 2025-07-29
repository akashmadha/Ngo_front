const mysql = require('mysql');
const fs = require('fs');
const path = require('path');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ngolinkup'
});

db.connect((err) => {
  if (err) {
    console.log("❌ MySQL connection error:", err);
    return;
  }
  console.log("✅ MySQL Connected");
  
  // Read the SQL file
  const sqlFile = path.join(__dirname, 'create_missing_tables.sql');
  const sql = fs.readFileSync(sqlFile, 'utf8');
  
  // Split SQL into individual statements
  const statements = sql.split(';').filter(stmt => stmt.trim());
  
  console.log("🔧 Creating missing tables...");
  
  let completed = 0;
  const total = statements.length;
  
  statements.forEach((statement, index) => {
    if (statement.trim()) {
      db.query(statement, (err) => {
        if (err) {
          console.log(`❌ Error executing statement ${index + 1}:`, err.message);
        } else {
          console.log(`✅ Statement ${index + 1} executed successfully`);
        }
        
        completed++;
        if (completed === total) {
          console.log("\n🎉 All tables created successfully!");
          
          // Verify tables exist
          const requiredTables = ['addresses', 'phones', 'emails', 'social_links', 'key_contacts', 'certification_details'];
          
          Promise.all(requiredTables.map(table => {
            return new Promise((resolve) => {
              db.query(`SHOW TABLES LIKE '${table}'`, (err, results) => {
                if (err) {
                  console.log(`❌ Error checking ${table} table:`, err);
                  resolve({ table, exists: false });
                } else {
                  resolve({ table, exists: results.length > 0 });
                }
              });
            });
          })).then(results => {
            console.log("\n📋 Table verification:");
            results.forEach(result => {
              console.log(`- ${result.table}: ${result.exists ? '✅ EXISTS' : '❌ MISSING'}`);
            });
            
            const allExist = results.every(r => r.exists);
            if (allExist) {
              console.log("\n🎉 All required tables are now available!");
              console.log("✅ OrganizationWizard should work correctly now.");
            } else {
              console.log("\n❌ Some tables are still missing. Please check the SQL file.");
            }
            
            db.end();
          });
        }
      });
    }
  });
}); 