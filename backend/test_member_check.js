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

async function checkCursurMember() {
  try {
    console.log('🔍 Checking for Cursur member...');
    
    // Check organization_members table
    const members = await dbQuery('SELECT * FROM organization_members WHERE organization_name LIKE "%Cursur%"');
    console.log(`✅ Found ${members.length} Cursur members in organization_members:`);
    members.forEach(member => {
      console.log(`  - ID: ${member.id}, Name: ${member.organization_name}, Email: ${member.email}, Status: ${member.status}`);
    });

    // Check all related tables for the latest member
    if (members.length > 0) {
      const latestMember = members[members.length - 1];
      console.log(`\n📋 Checking details for member ID: ${latestMember.id}`);
      
      // Check registration details
      const regDetails = await dbQuery('SELECT * FROM members_registration_details WHERE member_id = ?', [latestMember.id]);
      console.log(`  - Registration details: ${regDetails.length} records`);
      
      // Check addresses
      const addresses = await dbQuery('SELECT * FROM addresses WHERE member_id = ?', [latestMember.id]);
      console.log(`  - Addresses: ${addresses.length} records`);
      
      // Check phones
      const phones = await dbQuery('SELECT * FROM phones WHERE member_id = ?', [latestMember.id]);
      console.log(`  - Phones: ${phones.length} records`);
      
      // Check emails
      const emails = await dbQuery('SELECT * FROM emails WHERE member_id = ?', [latestMember.id]);
      console.log(`  - Emails: ${emails.length} records`);
      
      // Check social links
      const socialLinks = await dbQuery('SELECT * FROM social_links WHERE member_id = ?', [latestMember.id]);
      console.log(`  - Social links: ${socialLinks.length} records`);
      
      // Check certification details
      const certifications = await dbQuery('SELECT * FROM certification_details WHERE member_id = ?', [latestMember.id]);
      console.log(`  - Certifications: ${certifications.length} records`);
      
      // Check key contacts
      const keyContacts = await dbQuery('SELECT * FROM key_contacts WHERE member_id = ?', [latestMember.id]);
      console.log(`  - Key contacts: ${keyContacts.length} records`);
      
      console.log('\n🎉 Summary:');
      console.log(`  - Organization: ${latestMember.organization_name}`);
      console.log(`  - SPOC: ${latestMember.spoc_name}`);
      console.log(`  - Email: ${latestMember.email}`);
      console.log(`  - Status: ${latestMember.status}`);
      console.log(`  - Created: ${latestMember.created_at}`);
    }

  } catch (error) {
    console.error('❌ Error checking member:', error);
  } finally {
    db.end();
  }
}

// Run the script
checkCursurMember(); 