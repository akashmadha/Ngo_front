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
  
  // Test the registration_type field with different values
  const testValues = [
    { registrationType: null, description: 'NULL value' },
    { registrationType: 'Society', description: 'Valid Society' },
    { registrationType: 'Trust', description: 'Valid Trust' },
    { registrationType: 'Company', description: 'Valid Company' },
    { registrationType: '', description: 'Empty string (should be converted to NULL)' }
  ];
  
  console.log("🧪 Testing registration_type field...");
  
  let completed = 0;
  const total = testValues.length;
  
  testValues.forEach((test, index) => {
    const sql = `
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
      7, // member_id
      `Test Organization ${index + 1}`,
      test.registrationType,
      `REG${index + 1}`,
      JSON.stringify([{ detail: 'test', date: '2024-01-01' }])
    ];
    
    db.query(sql, params, (err, result) => {
      if (err) {
        console.log(`❌ Test ${index + 1} failed (${test.description}):`, err.message);
      } else {
        console.log(`✅ Test ${index + 1} passed (${test.description})`);
      }
      
      completed++;
      if (completed === total) {
        console.log("\n🎉 All tests completed!");
        
        // Show the current data
        db.query("SELECT member_id, organization_name, registration_type FROM members_registration_details WHERE member_id = 7", (err, results) => {
          if (err) {
            console.log("❌ Error querying results:", err);
          } else {
            console.log("\n📋 Current registration details for member 7:");
            results.forEach(row => {
              console.log(`- Organization: ${row.organization_name}, Type: ${row.registration_type || 'NULL'}`);
            });
          }
          
          db.end();
        });
      }
    });
  });
}); 