const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ngo_linkup'
});

const dbQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

async function addFinalData() {
  const memberId = 18;
  
  try {
    console.log(`🚀 Adding final data for Cursur member ID: ${memberId}...`);
    
    // 1. Add to phones table
    await dbQuery(`
      INSERT INTO phones (member_id, number, type, created_at) VALUES 
      (?, ?, ?, NOW()),
      (?, ?, ?, NOW())
    `, [
      memberId, '+91-9876543277', 'primary',
      memberId, '+91-8765432177', 'secondary'
    ]);
    console.log('✅ Added phone numbers');

    // 2. Add to emails table
    await dbQuery(`
      INSERT INTO emails (member_id, email, type, created_at) VALUES 
      (?, ?, ?, NOW()),
      (?, ?, ?, NOW())
    `, [
      memberId, 'cursur.demo@cursurtech.com', 'primary',
      memberId, 'support@cursurtech.com', 'secondary'
    ]);
    console.log('✅ Added email addresses');

    // 3. Add to social_links table
    await dbQuery(`
      INSERT INTO social_links (member_id, platform, link, created_at) VALUES 
      (?, ?, ?, NOW()),
      (?, ?, ?, NOW()),
      (?, ?, ?, NOW())
    `, [
      memberId, 'LinkedIn', 'https://linkedin.com/company/cursurtech',
      memberId, 'Twitter', 'https://twitter.com/cursurtech',
      memberId, 'Website', 'https://cursurtech.com'
    ]);
    console.log('✅ Added social links');

    // 4. Add to certification_details table
    await dbQuery(`
      INSERT INTO certification_details (
        member_id,
        certification_name,
        issuing_authority,
        issue_date,
        expiry_date,
        created_at
      ) VALUES (?, ?, ?, ?, ?, NOW())
    `, [
      memberId,
      'ISO 9001:2015 Quality Management',
      'Bureau Veritas',
      '2023-03-15',
      '2026-03-15'
    ]);
    console.log('✅ Added certification details');

    // 5. Add to key_contacts table
    await dbQuery(`
      INSERT INTO key_contacts (
        member_id,
        name,
        designation,
        email,
        phone,
        created_at
      ) VALUES (?, ?, ?, ?, ?, NOW())
    `, [
      memberId,
      'Sarah Johnson',
      'Chief Operations Officer',
      'sarah.johnson@cursurtech.com',
      '+91-9876543211'
    ]);
    console.log('✅ Added key contact person');

    console.log('🎉 Successfully completed Cursur member with all 6 forms filled!');
    console.log(`📋 Member ID: ${memberId}`);
    console.log('📋 Organization: Cursur Technologies Pvt Ltd');
    console.log('📋 SPOC: John Cursur');
    console.log('📋 Email: cursur.demo@cursurtech.com');
    console.log('📋 Status: Active');
    console.log('📋 Registration Date: 2023-06-15');
    console.log('📋 Address: Bangalore, Karnataka');
    console.log('📋 Certification: ISO 9001:2015');
    console.log('📋 Key Contact: Sarah Johnson (COO)');

  } catch (error) {
    console.error('❌ Error adding final data:', error);
  } finally {
    db.end();
  }
}

// Run the script
addFinalData(); 