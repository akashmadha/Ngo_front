const mysql = require('mysql');

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
  
  console.log("🧹 Cleaning up dummy data from database...");
  
  // Clean up in the correct order (respecting foreign key constraints)
  const cleanupQueries = [
    // 1. Delete from child tables first
    "DELETE FROM certification_details WHERE member_id IN (SELECT id FROM organization_members WHERE email LIKE '%test%' OR email LIKE '%example%' OR organization_name LIKE '%Test%')",
    "DELETE FROM addresses WHERE member_id IN (SELECT id FROM organization_members WHERE email LIKE '%test%' OR email LIKE '%example%' OR organization_name LIKE '%Test%')",
    "DELETE FROM phones WHERE member_id IN (SELECT id FROM organization_members WHERE email LIKE '%test%' OR email LIKE '%example%' OR organization_name LIKE '%Test%')",
    "DELETE FROM emails WHERE member_id IN (SELECT id FROM organization_members WHERE email LIKE '%test%' OR email LIKE '%example%' OR organization_name LIKE '%Test%')",
    "DELETE FROM social_links WHERE member_id IN (SELECT id FROM organization_members WHERE email LIKE '%test%' OR email LIKE '%example%' OR organization_name LIKE '%Test%')",
    "DELETE FROM key_contacts WHERE member_id IN (SELECT id FROM organization_members WHERE email LIKE '%test%' OR email LIKE '%example%' OR organization_name LIKE '%Test%')",
    "DELETE FROM members_registration_details WHERE member_id IN (SELECT id FROM organization_members WHERE email LIKE '%test%' OR email LIKE '%example%' OR organization_name LIKE '%Test%')",
    "DELETE FROM documents WHERE member_id IN (SELECT id FROM organization_members WHERE email LIKE '%test%' OR email LIKE '%example%' OR organization_name LIKE '%Test%')",
    
    // 2. Delete from main table
    "DELETE FROM organization_members WHERE email LIKE '%test%' OR email LIKE '%example%' OR organization_name LIKE '%Test%'",
    
    // 3. Clean up any remaining test data
    "DELETE FROM organization_members WHERE organization_name LIKE '%Test%' OR organization_name LIKE '%Demo%'",
    "DELETE FROM organization_members WHERE spoc_name LIKE '%Test%' OR spoc_name LIKE '%Demo%'",
    "DELETE FROM organization_members WHERE email LIKE '%test@%' OR email LIKE '%demo@%'",
    
    // 4. Clean up specific test entries
    "DELETE FROM organization_members WHERE email = 'test@example.com'",
    "DELETE FROM organization_members WHERE email = 'test@test.com'",
    "DELETE FROM organization_members WHERE organization_name = 'Test Organization'",
    "DELETE FROM organization_members WHERE organization_name = 'Test NGO'",
    "DELETE FROM organization_members WHERE organization_name = 'Demo Organization'",
    
    // 5. Clean up any entries with test PAN numbers
    "DELETE FROM organization_members WHERE pan_no LIKE '%TEST%' OR pan_no LIKE '%DEMO%'"
  ];
  
  let completed = 0;
  const total = cleanupQueries.length;
  
  cleanupQueries.forEach((query, index) => {
    db.query(query, (err, result) => {
      if (err) {
        console.log(`❌ Error in query ${index + 1}:`, err.message);
      } else {
        if (result.affectedRows > 0) {
          console.log(`✅ Query ${index + 1}: Deleted ${result.affectedRows} records`);
        } else {
          console.log(`ℹ️ Query ${index + 1}: No records to delete`);
        }
      }
      
      completed++;
      if (completed === total) {
        console.log("\n🎉 Cleanup completed!");
        
        // Show remaining data
        db.query("SELECT COUNT(*) as total FROM organization_members", (err, results) => {
          if (err) {
            console.log("❌ Error counting remaining members:", err.message);
          } else {
            console.log(`📊 Remaining members in database: ${results[0].total}`);
          }
          
          // Show sample of remaining data
          db.query("SELECT id, organization_name, email, status FROM organization_members LIMIT 5", (err, results) => {
            if (err) {
              console.log("❌ Error fetching sample data:", err.message);
            } else {
              console.log("\n📋 Sample of remaining members:");
              results.forEach(row => {
                console.log(`- ID: ${row.id}, Organization: ${row.organization_name}, Email: ${row.email}, Status: ${row.status}`);
              });
            }
            
            db.end();
          });
        });
      }
    });
  });
}); 