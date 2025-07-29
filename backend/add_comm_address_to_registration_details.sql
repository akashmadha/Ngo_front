-- Add communication address fields to members_registration_details
ALTER TABLE members_registration_details
  ADD COLUMN comm_address1 VARCHAR(255),
  ADD COLUMN comm_address2 VARCHAR(255),
  ADD COLUMN comm_state VARCHAR(100),
  ADD COLUMN comm_district VARCHAR(100),
  ADD COLUMN comm_tahsil VARCHAR(100),
  ADD COLUMN comm_city VARCHAR(100),
  ADD COLUMN comm_pincode VARCHAR(20); 