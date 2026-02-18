-- Health Insurance Web Application - Database Schema

CREATE DATABASE IF NOT EXISTS health_insurance;
USE health_insurance;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insurance Plans table
CREATE TABLE IF NOT EXISTS insurance_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plan_name VARCHAR(100) NOT NULL,
    coverage_amount DECIMAL(12, 2) NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Predictions table
CREATE TABLE IF NOT EXISTS predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(10),
    bmi DECIMAL(5, 2) NOT NULL,
    smoker TINYINT(1) DEFAULT 0,
    num_dependents INT DEFAULT 0,
    region VARCHAR(50),
    existing_conditions TEXT,
    predicted_premium DECIMAL(10, 2) NOT NULL,
    risk_category ENUM('Low', 'Medium', 'High') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- DEFAULT ACCOUNTS
-- =============================================

-- Admin account:  admin@healthinsure.com / admin123
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@healthinsure.com', '$2b$10$OP8Wrb5D5JKwC/rron4jv.3cAtmU/y14EEeNtqRbwNfRnvcVrnqXW', 'admin');

-- Default user account:  user@healthinsure.com / user123
INSERT INTO users (name, email, password, role) VALUES
('John Doe', 'user@healthinsure.com', '$2b$10$x3KdpIjhdU7Bf3SRVT/I2OBwt.F1NYNFQHzzZhAmn1XU4pCk6WdBu', 'user');

-- Seed insurance plans
INSERT INTO insurance_plans (plan_name, coverage_amount, base_price, description) VALUES
('Basic Shield', 100000.00, 2500.00, 'Essential coverage for individuals. Includes basic hospitalization, outpatient care, and emergency services.'),
('Family Guardian', 500000.00, 7500.00, 'Comprehensive family coverage. Covers hospitalization, maternity, dental, and vision for up to 5 family members.'),
('Premium Elite', 1000000.00, 15000.00, 'Our best plan with unlimited coverage. Includes international treatment, specialist consultations, and wellness programs.'),
('Senior Care Plus', 300000.00, 5000.00, 'Tailored for individuals aged 55+. Covers chronic conditions, physiotherapy, home nursing, and prescription drugs.');

-- Purchases table
CREATE TABLE IF NOT EXISTS purchases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    prediction_id INT,
    plan_name VARCHAR(100) NOT NULL,
    coverage_amount DECIMAL(12, 2) NOT NULL,
    premium_amount DECIMAL(10, 2) NOT NULL,
    duration_years INT DEFAULT 1,
    status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (prediction_id) REFERENCES predictions(id) ON DELETE SET NULL
);

-- Seed some prediction history for the default user
INSERT INTO predictions (user_id, age, gender, bmi, smoker, num_dependents, region, existing_conditions, predicted_premium, risk_category, created_at) VALUES
(2, 28, 'male', 24.5, 0, 1, 'northeast', '', 3200.50, 'Low', '2026-01-15 10:30:00'),
(2, 28, 'male', 24.5, 0, 1, 'northeast', 'asthma', 4800.00, 'Low', '2026-01-22 14:45:00'),
(2, 28, 'male', 25.0, 0, 2, 'northeast', 'asthma', 5200.75, 'Medium', '2026-02-01 09:15:00'),
(2, 29, 'male', 25.2, 1, 2, 'northeast', 'asthma, high blood pressure', 12500.00, 'High', '2026-02-10 16:20:00'),
(2, 29, 'male', 24.8, 0, 2, 'northeast', '', 3800.25, 'Low', '2026-02-15 11:00:00');
