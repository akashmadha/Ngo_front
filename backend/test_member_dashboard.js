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
  
  console.log("🧪 Testing Member Dashboard functionality...");
  
  // Check if we have any members in the database
  db.query("SELECT COUNT(*) as total FROM organization_members", (err, results) => {
    if (err) {
      console.log("❌ Error counting members:", err.message);
      return;
    }
    
    console.log(`📊 Total members in database: ${results[0].total}`);
    
    if (results[0].total === 0) {
      console.log("⚠️ No members found in database. Creating a test member...");
      
      // Create a test member
      const testMember = {
        organization_type: 'NGO',
        organization_name: 'Sample NGO',
        pan_no: 'SAMPLE123456',
        email: 'sample@ngo.org',
        mobile_no: '9876543210',
        spoc_name: 'Sample SPOC',
        password_hash: 'test123',
        status: 'active'
      };
      
      db.query(
        "INSERT INTO organization_members (organization_type, organization_name, pan_no, email, mobile_no, spoc_name, password_hash, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [testMember.organization_type, testMember.organization_name, testMember.pan_no, testMember.email, testMember.mobile_no, testMember.spoc_name, testMember.password_hash, testMember.status],
        (err, result) => {
          if (err) {
            console.log("❌ Error creating test member:", err.message);
            return;
          }
          
          console.log("✅ Test member created with ID:", result.insertId);
          console.log("📧 Email: sample@ngo.org");
          console.log("🔑 Password: test123");
          console.log("\n🎯 You can now test the member dashboard with these credentials!");
        }
      );
    } else {
      // Show existing members
      db.query("SELECT id, organization_name, email, status FROM organization_members LIMIT 5", (err, results) => {
        if (err) {
          console.log("❌ Error fetching members:", err.message);
          return;
        }
        
        console.log("\n📋 Available members for testing:");
        results.forEach(row => {
          console.log(`- ID: ${row.id}, Organization: ${row.organization_name}, Email: ${row.email}, Status: ${row.status}`);
        });
        
        console.log("\n🎯 You can use any of these members to test the dashboard!");
      });
    }
    
    // Check if required tables exist
    const requiredTables = [
      'organization_members',
      'members_registration_details', 
      'certification_details',
      'addresses',
      'phones',
      'emails',
      'social_links',
      'key_contacts'
    ];
    
    console.log("\n🔍 Checking required tables...");
    let tablesChecked = 0;
    
    requiredTables.forEach(table => {
      db.query(`SHOW TABLES LIKE '${table}'`, (err, results) => {
        if (err) {
          console.log(`❌ Error checking table ${table}:`, err.message);
        } else if (results.length > 0) {
          console.log(`✅ Table ${table} exists`);
        } else {
          console.log(`❌ Table ${table} is missing`);
        }
        
        tablesChecked++;
        if (tablesChecked === requiredTables.length) {
          console.log("\n🎉 Database check completed!");
          console.log("\n📝 Next steps:");
          console.log("1. Start the backend server: npm start");
          console.log("2. Start the frontend: cd ../Front-end && npm run dev");
          console.log("3. Visit http://localhost:5173/member-dashboard");
          console.log("4. Login with member credentials");
          console.log("5. Test the 'Complete Your Profile' form");
          
          db.end();
        }
      });
    });
  });
}); 