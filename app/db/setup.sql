-- Djanam QR Menu System - Database Setup
-- Run this in MySQL/MariaDB after creating the database

CREATE DATABASE IF NOT EXISTS djanam_menu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE djanam_menu;

-- Note: Tables are created automatically by Drizzle ORM when you run `npm run db:push`
-- This script is for reference only. Use the Drizzle migration commands for actual setup.

-- Quick start:
-- 1. Create database: CREATE DATABASE djanam_menu;
-- 2. Set permissions: GRANT ALL ON djanam_menu.* TO 'your_user'@'%';
-- 3. Run: npm run db:push
-- 4. Seed: curl -X POST http://localhost:3000/api/trpc/seed.run -H 'Content-Type: application/json' -d '{"json":{}}'
