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
  
  // Check current foreign key constraints
  db.query("SHOW CREATE TABLE members_registration_details", (err, results) => {
    if (err) {
      console.log("❌ Error checking table structure:", err);
      return;
    }
    
    console.log("📋 Current table structure:");
    console.log(results[0]['Create Table']);
    
    // Drop the existing foreign key constraint
    console.log("\n🔧 Dropping existing foreign key constraint...");
    db.query("ALTER TABLE members_registration_details DROP FOREIGN KEY members_registration_details_ibfk_1", (err) => {
      if (err) {
        console.log("❌ Error dropping foreign key:", err.message);
        // Try alternative constraint name
        db.query("ALTER TABLE members_registration_details DROP FOREIGN KEY members_registration_details_ibfk_2", (err2) => {
          if (err2) {
            console.log("❌ Error dropping alternative foreign key:", err2.message);
            console.log("⚠️  Foreign key constraint might not exist or have different name");
          } else {
            console.log("✅ Alternative foreign key constraint dropped");
            addCorrectForeignKey();
          }
        });
      } else {
        console.log("✅ Foreign key constraint dropped");
        addCorrectForeignKey();
      }
    });
  });
  
  function addCorrectForeignKey() {
    console.log("\n🔧 Adding correct foreign key constraint...");
    db.query("ALTER TABLE members_registration_details ADD CONSTRAINT fk_member_id FOREIGN KEY (member_id) REFERENCES organization_members(id) ON DELETE CASCADE", (err) => {
      if (err) {
        console.log("❌ Error adding foreign key:", err.message);
        return;
      }
      
      console.log("✅ Correct foreign key constraint added");
      
      // Test the fix
      console.log("\n🧪 Testing the fix...");
      const testSQL = `
        INSERT INTO members_registration_details 
        (member_id, organization_name, registration_type, registration_no, other_details) 
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
        organization_name=VALUES(organization_name), 
        registration_type=VALUES(registration_type), 
        registration_no=VALUES(registration_no), 
        other_details=VALUES(other_details)
      `;
      
      const params = [
        7, // member_id (exists in organization_members)
        'Test Organization',
        'Society',
        'REG001',
        JSON.stringify([{ detail: 'test', date: '2024-01-01' }])
      ];
      
      db.query(testSQL, params, (err, result) => {
        if (err) {
          console.log("❌ Test failed:", err.message);
        } else {
          console.log("✅ Test passed! Foreign key constraint is working correctly");
        }
        
        db.end();
      });
    });
  }
}); 