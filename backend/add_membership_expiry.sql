-- Add membership_expiry_date field to organization_members table
ALTER TABLE organization_members ADD COLUMN membership_expiry_date DATE;

-- Update existing members to have expiry date 365 days from created_at
UPDATE organization_members 
SET membership_expiry_date = DATE_ADD(created_at, INTERVAL 365 DAY)
WHERE membership_expiry_date IS NULL;

-- Add index for better performance
CREATE INDEX idx_membership_expiry ON organization_members(membership_expiry_date); 