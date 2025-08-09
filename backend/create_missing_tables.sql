-- Create missing tables for OrganizationWizard functionality

-- Create addresses table
CREATE TABLE IF NOT EXISTS addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    type ENUM('permanent', 'communication') NOT NULL,
    address1 VARCHAR(255),
    address2 VARCHAR(255),
    state VARCHAR(100),
    district VARCHAR(100),
    tahsil VARCHAR(100),
    city VARCHAR(100),
    pincode VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES organization_members(id) ON DELETE CASCADE,
    INDEX idx_member_id (member_id),
    INDEX idx_type (type)
);

-- Create phones table
CREATE TABLE IF NOT EXISTS phones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    number VARCHAR(15) NOT NULL,
    type ENUM('primary', 'secondary', 'fax') DEFAULT 'primary',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES organization_members(id) ON DELETE CASCADE,
    INDEX idx_member_id (member_id),
    INDEX idx_type (type)
);

-- Create emails table
CREATE TABLE IF NOT EXISTS emails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    type ENUM('primary', 'secondary', 'support') DEFAULT 'primary',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES organization_members(id) ON DELETE CASCADE,
    INDEX idx_member_id (member_id),
    INDEX idx_type (type)
);

-- Create social_links table
CREATE TABLE IF NOT EXISTS social_links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    platform VARCHAR(100),
    url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES organization_members(id) ON DELETE CASCADE,
    INDEX idx_member_id (member_id)
);

-- Create key_contacts table
CREATE TABLE IF NOT EXISTS key_contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(15),
    email VARCHAR(255),
    designation VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES organization_members(id) ON DELETE CASCADE,
    INDEX idx_member_id (member_id)
);

-- Create certification_details table
CREATE TABLE IF NOT EXISTS certification_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    reg12A VARCHAR(100),
    reg12ADate DATE,
    reg80G VARCHAR(100),
    reg80GDate DATE,
    reg35AC VARCHAR(100),
    reg35ACDate DATE,
    regFCRA VARCHAR(100),
    regFCRADate DATE,
    regCSR1 VARCHAR(100),
    regCSR1Date DATE,
    regGCSR VARCHAR(100),
    regGCSRDate DATE,
    other_detail VARCHAR(255),
    other_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES organization_members(id) ON DELETE CASCADE,
    INDEX idx_member_id (member_id)
);

-- Show all tables
SHOW TABLES; 