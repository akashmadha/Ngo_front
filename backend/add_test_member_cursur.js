const mysql = require('mysql');
require('dotenv').config();

// Database connection
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

async function addTestMemberCursur() {
  try {
    console.log('🚀 Starting to add test member "cursur"...');
    
    // 1. Add to organization_members table
    const memberResult = await dbQuery(`
      INSERT INTO organization_members (
        organization_type,
        organization_name, 
        pan_no,
        spoc_name, 
        email, 
        mobile_no, 
        status, 
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `, [
      'NGO',
      'Cursur Technologies Pvt Ltd',
      'CURSR8888F',
      'John Cursur',
      'cursur.demo@cursurtech.com',
      '+91-9876543277',
      'active'
    ]);
    
    const memberId = memberResult.insertId;
    console.log(`✅ Added member with ID: ${memberId}`);

    // 2. Add to members_registration_details table
    await dbQuery(`
      INSERT INTO members_registration_details (
        member_id,
        organization_name,
        registration_type,
        registration_no,
        registration_date,
        pan_no,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, NOW())
    `, [
      memberId,
      'Cursur Technologies Pvt Ltd',
      'NGO',
      'CURSR001234',
      '2023-06-15',
      'CURSR8888F',
    ]);
    console.log('✅ Added registration details');

    // 3. Add to addresses table (Registered Office Address)
    await dbQuery(`
      INSERT INTO addresses (
        member_id,
        type,
        address_line1,
        address_line2,
        city,
        state,
        district,
        pincode,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, [
      memberId,
      'permanent',
      'Cursur Tower, Tech Park',
      'Floor 5, Block A',
      'Bangalore',
      'Karnataka',
      'Bangalore Urban',
      '560001'
    ]);
    console.log('✅ Added registered office address');

    // 4. Add to phones table
    await dbQuery(`
      INSERT INTO phones (member_id, phone_number, type, created_at) VALUES 
      (?, ?, ?, NOW()),
      (?, ?, ?, NOW())
    `, [
      memberId, '+91-9876543277', 'primary',
      memberId, '+91-8765432177', 'secondary'
    ]);
    console.log('✅ Added phone numbers');

    // 5. Add to emails table
    await dbQuery(`
      INSERT INTO emails (member_id, email_address, type, created_at) VALUES 
      (?, ?, ?, NOW()),
      (?, ?, ?, NOW())
    `, [
      memberId, 'cursur.demo@cursurtech.com', 'primary',
      memberId, 'support@cursurtech.com', 'secondary'
    ]);
    console.log('✅ Added email addresses');

    // 6. Add to social_links table
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

    // 7. Add to certification_details table
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

    // 8. Add to key_contacts table
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

    console.log('🎉 Successfully added test member "cursur" with all 6 forms filled!');
    console.log(`📋 Member ID: ${memberId}`);
    console.log('📋 Organization: Cursur Technologies Pvt Ltd');
    console.log('📋 SPOC: John Cursur');
    console.log('📋 Email: john.cursur@cursurtech.com');
    console.log('📋 Status: Active');
    console.log('📋 Registration Date: 2023-06-15');
    console.log('📋 Address: Bangalore, Karnataka');
    console.log('📋 Certification: ISO 9001:2015');
    console.log('📋 Key Contact: Sarah Johnson (COO)');

  } catch (error) {
    console.error('❌ Error adding test member:', error);
  } finally {
    db.end();
  }
}

// Run the script
addTestMemberCursur(); 