const db = require('./db');

const sqlCommands = [
  "ALTER TABLE organization_members ADD COLUMN membership_expiry_date DATE",
  "UPDATE organization_members SET membership_expiry_date = DATE_ADD(created_at, INTERVAL 365 DAY) WHERE membership_expiry_date IS NULL",
  "CREATE INDEX idx_membership_expiry ON organization_members(membership_expiry_date)"
];

async function addMembershipExpiry() {
  try {
    console.log('Adding membership expiry date field...');
    
    for (const sql of sqlCommands) {
      await new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
          if (err) {
            console.log('Error:', err.message);
            // Continue even if index already exists
            if (err.code === 'ER_DUP_KEYNAME') {
              console.log('Index already exists, skipping...');
            }
          } else {
            console.log('Success:', sql);
          }
          resolve();
        });
      });
    }
    
    console.log('✅ Membership expiry date field added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addMembershipExpiry(); 