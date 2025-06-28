-- Financial Tracker Database Initialization
-- This script ensures the database is ready for the application

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS financial_tracker;

-- Use the database
USE financial_tracker;

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON financial_tracker.* TO 'financial_user'@'%';
FLUSH PRIVILEGES;

-- Log initialization
SELECT 'Financial Tracker Database Initialized Successfully!' as Status;
