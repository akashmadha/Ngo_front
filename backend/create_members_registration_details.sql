-- Create members_registration_details table for member registration details
CREATE TABLE IF NOT EXISTS members_registration_details (
    member_id INT PRIMARY KEY,
    organization_name VARCHAR(255),
    registration_type VARCHAR(100),
    registration_no VARCHAR(100),
    registration_date DATE,
    other_registration_no VARCHAR(100),
    other_registration_date DATE,
    pan_no VARCHAR(20),
    tan_no VARCHAR(20),
    gst_no VARCHAR(20),
    niti_ayog_id VARCHAR(100),
    niti_ayog_reg_date DATE,
    other_details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES organization_members(id)
); 