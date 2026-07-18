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
-- 4. Seed (admin token required): curl -X POST http://localhost:3000/api/trpc/seed.run -H 'Content-Type: application/json' -H 'x-admin-token: YOUR_ADMIN_TOKEN' -d '{"json":{}}'

-- Migration for existing databases (product badges + allergens).
-- `npm run db:push` applies this automatically; run manually only if pushing is not possible:
-- ALTER TABLE products ADD COLUMN tags JSON NULL, ADD COLUMN allergens JSON NULL;

-- ALTER: service requests (call waiter / bill) — прилага се от npm run db:push
-- CREATE TABLE service_requests (id, table_id, type, status DEFAULT 'pending', created_at);
