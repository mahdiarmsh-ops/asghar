-- Database Migration Script for "Cultural Sponsorship" (کفالت فرهنگی)
-- Compatible with PostgreSQL / MySQL

-- 1. Create Roles/Enum Types (PostgreSQL specific, optional for MySQL)
CREATE TYPE user_role AS ENUM ('Sponsor', 'Admin');
CREATE TYPE sponsorship_status_type AS ENUM ('Unsponsored', 'Partially_Sponsored', 'Fully_Sponsored');
CREATE TYPE class_log_status_type AS ENUM ('Held', 'Pending');
CREATE TYPE subject_type AS ENUM ('Art', 'Quran', 'Religious Studies');

-- 2. Users / Sponsors Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role user_role DEFAULT 'Sponsor' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Students Pool Table
CREATE TABLE IF NOT EXISTS students_pool (
    id VARCHAR(50) PRIMARY KEY,
    pseudonym_name VARCHAR(100) NOT NULL,
    school_name VARCHAR(200) NOT NULL,
    grade VARCHAR(50) NOT NULL,
    subject subject_type NOT NULL,
    sponsorship_status sponsorship_status_type DEFAULT 'Unsponsored' NOT NULL,
    sessions_held INT DEFAULT 0 CHECK (sessions_held >= 0 AND sessions_held <= 24),
    assigned_sponsor_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    amount_needed DECIMAL(12, 2) DEFAULT 2880000.00 NOT NULL,
    amount_sponsored DECIMAL(12, 2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Sponsorship Transactions Table
CREATE TABLE IF NOT EXISTS sponsorships (
    id VARCHAR(50) PRIMARY KEY,
    sponsor_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id VARCHAR(50) NOT NULL REFERENCES students_pool(id) ON DELETE CASCADE,
    amount_paid DECIMAL(12, 2) NOT NULL,
    sessions_bought INT NOT NULL,
    receipt_no VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Class Logs Table (Session tracking checklist)
CREATE TABLE IF NOT EXISTS class_logs (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL REFERENCES students_pool(id) ON DELETE CASCADE,
    school_name VARCHAR(200) NOT NULL,
    grade VARCHAR(50) NOT NULL,
    subject subject_type NOT NULL,
    status class_log_status_type DEFAULT 'Pending' NOT NULL,
    session_number INT NOT NULL CHECK (session_number >= 1 AND session_number <= 24),
    date_conducted TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indices for rapid indexing and stats aggregates
CREATE INDEX IF NOT EXISTS idx_student_status ON students_pool(sponsorship_status);
CREATE INDEX IF NOT EXISTS idx_class_log_status ON class_logs(status);
CREATE INDEX IF NOT EXISTS idx_sponsorship_sponsor ON sponsorships(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_sponsorship_student ON sponsorships(student_id);

-- Initial Mock Data Seed
INSERT INTO users (id, name, email, phone, role) VALUES 
('sp-1', 'محمدرضا سلیمانی', 'm.soleimani@example.com', '09121111111', 'Sponsor'),
('sp-2', 'زهرا حسینی', 'z.hosseini@example.com', '09122222222', 'Sponsor'),
('admin-1', 'مدیر پلتفرم کفالت', 'admin@kafalat.ir', '09120000000', 'Admin')
ON CONFLICT (id) DO NOTHING;

INSERT INTO students_pool (id, pseudonym_name, school_name, grade, subject, sponsorship_status, sessions_held, assigned_sponsor_id, amount_needed, amount_sponsored) VALUES
('st-1', 'امیررضا براهویی', 'دبستان ابوذر دشتیاری', 'چهارم ابتدایی', 'Art', 'Fully_Sponsored', 18, 'sp-1', 0, 2880000),
('st-2', 'فاطمه رئیسی', 'دبستان دخترانه زینبیه بشاگرد', 'پنجم ابتدایی', 'Quran', 'Partially_Sponsored', 12, 'sp-2', 1200000, 1680000),
('st-3', 'سمیه قلعه‌گنجی', 'مدرسه حضرت رقیه قلعه‌گنج', 'سوم ابتدایی', 'Religious Studies', 'Unsponsored', 0, NULL, 2880000, 0),
('st-4', 'محمد جلال میربلوچ', 'دبستان عشایری شهید همت ریگان', 'ششم ابتدایی', 'Art', 'Unsponsored', 0, NULL, 2880000, 0)
ON CONFLICT (id) DO NOTHING;
