-- Pestilink Database Creation Script
-- Run this in MySQL to create the database

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS pestilink 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Verify creation
SHOW DATABASES LIKE 'pestilink';

-- Use the database
USE pestilink;

-- Show tables (should be empty initially)
SHOW TABLES;






