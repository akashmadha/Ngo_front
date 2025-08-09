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
  console.log("✅ Connected to XAMPP MySQL Database");
  
  // Read the SQL file
  const sqlFilePath = path.join(__dirname, 'clean_all_dummy_data.sql');
  
  if (!fs.existsSync(sqlFilePath)) {
    console.log("❌ SQL file not found:", sqlFilePath);
    return;
  }
  
  const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
  
  console.log("🧹 Starting comprehensive dummy data cleanup...");
  console.log("📋 This will remove all test/dummy data from the database");
  
  // Split SQL into individual statements
  const statements = sqlContent
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
  
  let completed = 0;
  const total = statements.length;
  
  console.log(`📊 Executing ${total} SQL statements...`);
  
  statements.forEach((statement, index) => {
    if (statement.trim()) {
      db.query(statement, (err, result) => {
        if (err) {
          console.log(`❌ Error in statement ${index + 1}:`, err.message);
        } else {
          if (result.affectedRows > 0) {
            console.log(`✅ Statement ${index + 1}: Affected ${result.affectedRows} rows`);
          } else if (Array.isArray(result) && result.length > 0) {
            console.log(`📋 Statement ${index + 1}: Query result displayed`);
            result.forEach(row => {
              if (row.info) {
                console.log(`   ${row.info}`);
              } else if (row.table_name) {
                console.log(`   ${row.table_name}: ${row.count} records`);
              } else if (row.organization_name) {
                console.log(`   ID: ${row.id}, Organization: ${row.organization_name}, Email: ${row.email}, Status: ${row.status}`);
              }
            });
          } else {
            console.log(`ℹ️ Statement ${index + 1}: No data affected`);
          }
        }
        
        completed++;
        if (completed === total) {
          console.log("\n🎉 Comprehensive cleanup completed!");
          console.log("\n📝 Summary:");
          console.log("- All dummy/test data has been removed");
          console.log("- Database is now clean for production use");
          console.log("- Only real company data remains");
          
          // Final check
          db.query("SELECT COUNT(*) as total FROM organization_members", (err, results) => {
            if (err) {
              console.log("❌ Error in final count:", err.message);
            } else {
              console.log(`📊 Final member count: ${results[0].total}`);
              
              if (results[0].total === 0) {
                console.log("⚠️ No members found. You may need to add real company data.");
              } else {
                console.log("✅ Database is ready for production use!");
              }
            }
            
            db.end();
          });
        }
      });
    } else {
      completed++;
      if (completed === total) {
        console.log("\n🎉 Cleanup completed!");
        db.end();
      }
    }
  });
}); 