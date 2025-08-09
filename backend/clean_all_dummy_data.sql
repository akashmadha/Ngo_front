-- Clean All Dummy Data from NGO Linkup Database
-- This script removes all test/dummy data from the database

-- First, let's see what data exists
SELECT 'Current Data Count' as info;
SELECT 'organization_members' as table_name, COUNT(*) as count FROM organization_members
UNION ALL
SELECT 'members_registration_details' as table_name, COUNT(*) as count FROM members_registration_details
UNION ALL
SELECT 'certification_details' as table_name, COUNT(*) as count FROM certification_details
UNION ALL
SELECT 'addresses' as table_name, COUNT(*) as count FROM addresses
UNION ALL
SELECT 'phones' as table_name, COUNT(*) as count FROM phones
UNION ALL
SELECT 'emails' as table_name, COUNT(*) as count FROM emails
UNION ALL
SELECT 'social_links' as table_name, COUNT(*) as table_name FROM social_links
UNION ALL
SELECT 'key_contacts' as table_name, COUNT(*) as count FROM key_contacts
UNION ALL
SELECT 'documents' as table_name, COUNT(*) as count FROM documents;

-- Clean up in the correct order (respecting foreign key constraints)
-- 1. Delete from child tables first

-- Delete certification details for test members
DELETE FROM certification_details 
WHERE member_id IN (
    SELECT id FROM organization_members 
    WHERE email LIKE '%test%' 
    OR email LIKE '%example%' 
    OR email LIKE '%demo%'
    OR organization_name LIKE '%Test%'
    OR organization_name LIKE '%Demo%'
    OR organization_name LIKE '%Sample%'
    OR spoc_name LIKE '%Test%'
    OR spoc_name LIKE '%Demo%'
    OR spoc_name LIKE '%Sample%'
);

-- Delete addresses for test members
DELETE FROM addresses 
WHERE member_id IN (
    SELECT id FROM organization_members 
    WHERE email LIKE '%test%' 
    OR email LIKE '%example%' 
    OR email LIKE '%demo%'
    OR organization_name LIKE '%Test%'
    OR organization_name LIKE '%Demo%'
    OR organization_name LIKE '%Sample%'
    OR spoc_name LIKE '%Test%'
    OR spoc_name LIKE '%Demo%'
    OR spoc_name LIKE '%Sample%'
);

-- Delete phones for test members
DELETE FROM phones 
WHERE member_id IN (
    SELECT id FROM organization_members 
    WHERE email LIKE '%test%' 
    OR email LIKE '%example%' 
    OR email LIKE '%demo%'
    OR organization_name LIKE '%Test%'
    OR organization_name LIKE '%Demo%'
    OR organization_name LIKE '%Sample%'
    OR spoc_name LIKE '%Test%'
    OR spoc_name LIKE '%Demo%'
    OR spoc_name LIKE '%Sample%'
);

-- Delete emails for test members
DELETE FROM emails 
WHERE member_id IN (
    SELECT id FROM organization_members 
    WHERE email LIKE '%test%' 
    OR email LIKE '%example%' 
    OR email LIKE '%demo%'
    OR organization_name LIKE '%Test%'
    OR organization_name LIKE '%Demo%'
    OR organization_name LIKE '%Sample%'
    OR spoc_name LIKE '%Test%'
    OR spoc_name LIKE '%Demo%'
    OR spoc_name LIKE '%Sample%'
);

-- Delete social links for test members
DELETE FROM social_links 
WHERE member_id IN (
    SELECT id FROM organization_members 
    WHERE email LIKE '%test%' 
    OR email LIKE '%example%' 
    OR email LIKE '%demo%'
    OR organization_name LIKE '%Test%'
    OR organization_name LIKE '%Demo%'
    OR organization_name LIKE '%Sample%'
    OR spoc_name LIKE '%Test%'
    OR spoc_name LIKE '%Demo%'
    OR spoc_name LIKE '%Sample%'
);

-- Delete key contacts for test members
DELETE FROM key_contacts 
WHERE member_id IN (
    SELECT id FROM organization_members 
    WHERE email LIKE '%test%' 
    OR email LIKE '%example%' 
    OR email LIKE '%demo%'
    OR organization_name LIKE '%Test%'
    OR organization_name LIKE '%Demo%'
    OR organization_name LIKE '%Sample%'
    OR spoc_name LIKE '%Test%'
    OR spoc_name LIKE '%Demo%'
    OR spoc_name LIKE '%Sample%'
);

-- Delete registration details for test members
DELETE FROM members_registration_details 
WHERE member_id IN (
    SELECT id FROM organization_members 
    WHERE email LIKE '%test%' 
    OR email LIKE '%example%' 
    OR email LIKE '%demo%'
    OR organization_name LIKE '%Test%'
    OR organization_name LIKE '%Demo%'
    OR organization_name LIKE '%Sample%'
    OR spoc_name LIKE '%Test%'
    OR spoc_name LIKE '%Demo%'
    OR spoc_name LIKE '%Sample%'
);

-- Delete documents for test members
DELETE FROM documents 
WHERE member_id IN (
    SELECT id FROM organization_members 
    WHERE email LIKE '%test%' 
    OR email LIKE '%example%' 
    OR email LIKE '%demo%'
    OR organization_name LIKE '%Test%'
    OR organization_name LIKE '%Demo%'
    OR organization_name LIKE '%Sample%'
    OR spoc_name LIKE '%Test%'
    OR spoc_name LIKE '%Demo%'
    OR spoc_name LIKE '%Sample%'
);

-- 2. Delete from main table - organization_members
DELETE FROM organization_members 
WHERE email LIKE '%test%' 
OR email LIKE '%example%' 
OR email LIKE '%demo%'
OR organization_name LIKE '%Test%'
OR organization_name LIKE '%Demo%'
OR organization_name LIKE '%Sample%'
OR spoc_name LIKE '%Test%'
OR spoc_name LIKE '%Demo%'
OR spoc_name LIKE '%Sample%'
OR pan_no LIKE '%TEST%'
OR pan_no LIKE '%DEMO%'
OR pan_no LIKE '%SAMPLE%';

-- 3. Clean up specific test entries
DELETE FROM organization_members WHERE email = 'test@example.com';
DELETE FROM organization_members WHERE email = 'test@test.com';
DELETE FROM organization_members WHERE email = 'demo@demo.com';
DELETE FROM organization_members WHERE email = 'sample@sample.com';
DELETE FROM organization_members WHERE organization_name = 'Test Organization';
DELETE FROM organization_members WHERE organization_name = 'Test NGO';
DELETE FROM organization_members WHERE organization_name = 'Demo Organization';
DELETE FROM organization_members WHERE organization_name = 'Sample Organization';

-- 4. Clean up any entries with obvious test data
DELETE FROM organization_members WHERE organization_name LIKE '%Dummy%';
DELETE FROM organization_members WHERE organization_name LIKE '%Fake%';
DELETE FROM organization_members WHERE spoc_name LIKE '%Dummy%';
DELETE FROM organization_members WHERE spoc_name LIKE '%Fake%';
DELETE FROM organization_members WHERE email LIKE '%dummy%';
DELETE FROM organization_members WHERE email LIKE '%fake%';

-- Show remaining data after cleanup
SELECT 'Data After Cleanup' as info;
SELECT 'organization_members' as table_name, COUNT(*) as count FROM organization_members
UNION ALL
SELECT 'members_registration_details' as table_name, COUNT(*) as count FROM members_registration_details
UNION ALL
SELECT 'certification_details' as table_name, COUNT(*) as count FROM certification_details
UNION ALL
SELECT 'addresses' as table_name, COUNT(*) as count FROM addresses
UNION ALL
SELECT 'phones' as table_name, COUNT(*) as count FROM phones
UNION ALL
SELECT 'emails' as table_name, COUNT(*) as count FROM emails
UNION ALL
SELECT 'social_links' as table_name, COUNT(*) as count FROM social_links
UNION ALL
SELECT 'key_contacts' as table_name, COUNT(*) as count FROM key_contacts
UNION ALL
SELECT 'documents' as table_name, COUNT(*) as count FROM documents;

-- Show remaining members
SELECT 'Remaining Members:' as info;
SELECT id, organization_name, email, spoc_name, status FROM organization_members ORDER BY id; 