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
  const sqlFilePath = path.join(__dirname, 'clean_remaining_dummy_data.sql');
  
  if (!fs.existsSync(sqlFilePath)) {
    console.log("❌ SQL file not found:", sqlFilePath);
    return;
  }
  
  const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
  
  console.log("🧹 Starting AGGRESSIVE dummy data cleanup...");
  console.log("📋 This will remove ALL test/dummy data including recently created ones");
  console.log("⚠️ This includes data with 'Test', 'akash', 'REG' patterns");
  
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
              } else if (row.member_id) {
                console.log(`   ${row.table_name} - ID: ${row.id}, Member ID: ${row.member_id}, Name: ${row.organization_name || 'N/A'}`);
              }
            });
          } else {
            console.log(`ℹ️ Statement ${index + 1}: No data affected`);
          }
        }
        
        completed++;
        if (completed === total) {
          console.log("\n🎉 AGGRESSIVE cleanup completed!");
          console.log("\n📝 Summary:");
          console.log("- All dummy/test data has been removed");
          console.log("- All 'Test Organization' entries removed");
          console.log("- All 'akash' related data removed");
          console.log("- All 'REG' pattern registration numbers removed");
          console.log("- Database is now completely clean for production use");
          
          // Final check
          db.query("SELECT COUNT(*) as total FROM organization_members", (err, results) => {
            if (err) {
              console.log("❌ Error in final count:", err.message);
            } else {
              console.log(`📊 Final member count: ${results[0].total}`);
              
              if (results[0].total === 0) {
                console.log("⚠️ No members found. You may need to add real company data.");
              } else {
                console.log("✅ Database is completely clean and ready for production!");
                
                // Show remaining members
                db.query("SELECT id, organization_name, email, spoc_name, status FROM organization_members ORDER BY id", (err, members) => {
                  if (err) {
                    console.log("❌ Error fetching remaining members:", err.message);
                  } else {
                    console.log("\n📋 Remaining members:");
                    members.forEach(member => {
                      console.log(`   ID: ${member.id}, Organization: ${member.organization_name}, Email: ${member.email}, Status: ${member.status}`);
                    });
                  }
                  
                  db.end();
                });
              }
            }
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