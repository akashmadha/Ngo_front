const db = require('./db');

async function updateMemberStatus() {
  try {
    console.log('Updating member status based on membership expiry...');
    
    // Update expired members to inactive
    const updateExpiredQuery = `
      UPDATE organization_members 
      SET status = 'inactive' 
      WHERE membership_expiry_date < CURDATE() 
      AND status != 'inactive'
    `;
    
    const updateExpiredResult = await new Promise((resolve, reject) => {
      db.query(updateExpiredQuery, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    
    console.log(`✅ Updated ${updateExpiredResult.affectedRows} expired members to inactive`);
    
    // Update members expiring within 30 days to pending
    const updatePendingQuery = `
      UPDATE organization_members 
      SET status = 'pending' 
      WHERE membership_expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
      AND status = 'active'
    `;
    
    const updatePendingResult = await new Promise((resolve, reject) => {
      db.query(updatePendingQuery, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    
    console.log(`✅ Updated ${updatePendingResult.affectedRows} expiring members to pending`);
    
    // Show current status summary
    const statusSummaryQuery = `
      SELECT 
        status,
        COUNT(*) as count,
        MIN(membership_expiry_date) as earliest_expiry,
        MAX(membership_expiry_date) as latest_expiry
      FROM organization_members 
      GROUP BY status
    `;
    
    const statusSummary = await new Promise((resolve, reject) => {
      db.query(statusSummaryQuery, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    
    console.log('\n📊 Current Member Status Summary:');
    statusSummary.forEach(row => {
      console.log(`- ${row.status}: ${row.count} members`);
      if (row.earliest_expiry) {
        console.log(`  Expiry range: ${row.earliest_expiry} to ${row.latest_expiry}`);
      }
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating member status:', error);
    process.exit(1);
  }
}

updateMemberStatus(); 