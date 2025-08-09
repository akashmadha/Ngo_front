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
  
  // Check all members
  db.query("SELECT id, organization_name, email, status, spoc_name FROM organization_members ORDER BY id", (err, results) => {
    if (err) {
      console.log("❌ Error querying members:", err);
      return;
    }
    
    console.log("📋 Members in database:");
    if (results.length === 0) {
      console.log("❌ No members found!");
    } else {
      results.forEach(member => {
        console.log(`- ID: ${member.id}, Name: ${member.organization_name}, Email: ${member.email}, Status: ${member.status}, SPOC: ${member.spoc_name}`);
      });
    }
    
    // Check documents
    db.query("SELECT id, document_name, member_id FROM documents ORDER BY member_id", (err, docResults) => {
      if (err) {
        console.log("❌ Error querying documents:", err);
        return;
      }
      
      console.log("\n📋 Documents in database:");
      if (docResults.length === 0) {
        console.log("❌ No documents found!");
      } else {
        docResults.forEach(doc => {
          console.log(`- ID: ${doc.id}, Name: ${doc.document_name}, Member ID: ${doc.member_id}`);
        });
      }
      
      db.end();
    });
  });
}); 