# Djanam QR Menu System - Deployment Guide

## Architecture Overview

This is a **full-stack application** with three components:

1. **Frontend** - React SPA (static files)
2. **Backend API** - Node.js + Hono + tRPC
3. **Database** - MySQL (or TiDB, MariaDB compatible)

## Prerequisites

- Node.js 20+
- MySQL 8.0+ (or MariaDB, TiDB)
- Nginx (recommended) or Apache
- PM2 (`npm install -g pm2`) for process management

---

## 1. Build the Application

```bash
# Install dependencies
npm install

# Build for production (creates dist/ folder with frontend + backend)
npm run build

# The output will be in:
# - dist/public/        ← Static frontend files
# - dist/boot.js        ← Node.js backend server
```

## 2. Database Setup

### Create a MySQL database
```sql
CREATE DATABASE djanam_menu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'djanam_user'@'%' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON djanam_menu.* TO 'djanam_user'@'%';
FLUSH PRIVILEGES;
```

### Configure environment variables
Create a `.env` file (copy from `.env.example`):

```env
# Database
DATABASE_URL=mysql://djanam_user:your_secure_password@localhost:3306/djanam_menu

# Server
PORT=3000
NODE_ENV=production

# Admin panel authentication (see "Admin authentication" below)
ADMIN_TOKEN=change-me-to-a-long-random-secret

# Seeding — set true only for the one-time seed, then back to false
ALLOW_SEED=false
```

> The frontend does **not** read `VITE_API_URL`. The API base URL is configured
> at runtime in `config.js` via `window.__DJANAM_API_URL__`
> (default `/menu/api/trpc`, served same-domain through the Vercel rewrite).

### Admin authentication (`ADMIN_TOKEN`)

The admin panel is protected by a shared secret. Set `ADMIN_TOKEN` to a long,
random string in your backend env (e.g. Railway → Variables). On login the admin
panel sends this value in the `x-admin-token` header, and the backend rejects any
request whose header does not match `ADMIN_TOKEN`. Never commit the real value.

### Run database migrations
```bash
# Push schema to database (development mode - creates tables automatically)
npm run db:push

# Or generate migration files for production:
npm run db:generate
npm run db:migrate
```

### Seed the database with menu data
```bash
# Start the dev server temporarily and seed:
npm run dev &
curl -X POST http://localhost:3000/api/trpc/seed.run \
  -H 'Content-Type: application/json' \
  -d '{"json":{}}'
```

---

## 3. Deployment Options

### Option A: Nginx + Node.js (Recommended)

**Nginx config** (`/etc/nginx/sites-available/djanam`):

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL certificates
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Frontend - static files
    location / {
        root /var/www/djanam/dist/public;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API - proxy to Node.js
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable the site:**
```bash
sudo ln -s /etc/nginx/sites-available/djanam /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**Run the backend with PM2:**
```bash
# Copy dist folder to server
scp -r dist/ user@server:/var/www/djanam/

# On the server, start the backend
pm2 start dist/boot.js --name "djanam-api"
pm2 save
pm2 startup systemd
```

---

### Option B: Docker Deployment

Create a `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    image: node:20-alpine
    working_dir: /app
    volumes:
      - ./:/app
    command: node dist/boot.js
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=mysql://djanam_user:password@db:3306/djanam_menu
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: djanam_menu
      MYSQL_USER: djanam_user
      MYSQL_PASSWORD: your_password
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./dist/public:/usr/share/nginx/html
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app

volumes:
  mysql_data:
```

---

### Option C: Shared Hosting (cPanel)

For shared hosting without Node.js support:

1. **Backend**: Deploy to a Node.js-compatible host (Railway, Render, DigitalOcean)
2. **Frontend**: Upload `dist/public/` contents to your `public_html/` folder
3. **API proxy**: Use `.htaccess` to proxy `/api/` to your external backend

`.htaccess` for shared hosting:
```apache
RewriteEngine On

# Proxy API calls to backend
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ https://your-backend-url.com/api/$1 [P,L]

# SPA routing - serve index.html for all routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]
```

---

## 4. File Structure on Server

```
/var/www/djanam/
├── .env                    # Environment variables (NEVER commit this)
├── .env.example            # Template for env vars
├── dist/
│   ├── public/             # Frontend static files
│   │   ├── index.html
│   │   ├── assets/
│   │   │   ├── index-*.js
│   │   │   └── index-*.css
│   │   └── bull-icon.png   # Restaurant logo
│   └── boot.js             # Backend server
├── package.json
├── db/
│   └── schema.ts           # Database schema reference
├── drizzle.config.ts
└── ecosystem.config.js     # PM2 config (optional)
```

---

## 5. PM2 Configuration (Recommended)

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'djanam-api',
    script: './dist/boot.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '500M',
    restart_delay: 3000,
    max_restarts: 5,
    min_uptime: '10s',
    watch: false,
    // Auto-restart on failure
    autorestart: true,
    // Don't restart if crashing too fast
    exp_backoff_restart_delay: 100
  }]
};
```

Start with PM2:
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

---

## 6. Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | MySQL connection string |
| `ADMIN_TOKEN` | Yes | Admin panel secret, compared against the `x-admin-token` header |
| `PORT` | No | Server port (default: 3000) |
| `NODE_ENV` | No | `production` or `development` |
| `ALLOW_SEED` | No | Set `true` only for the one-time seed, then back to `false` |

> Note: the frontend API base URL is **not** an env variable — it is set at
> runtime in `config.js` (`window.__DJANAM_API_URL__`).

---

## 7. Updating After Changes

```bash
# On your local machine - make changes, then:
npm run build

# Deploy to server
rsync -avz --delete dist/ user@server:/var/www/djanam/dist/

# Restart backend
ssh user@server "pm2 restart djanam-api"
```

---

## 8. QR Codes for Tables

After deployment, QR codes will point to:
```
https://your-domain.com/menu/{qrToken}
```

Generate QR codes from the Admin panel (`/admin/tables`) and print them for each table.

---

## 9. Troubleshooting

### "Cannot connect to database"
- Check `DATABASE_URL` is correct
- Ensure MySQL is running: `systemctl status mysql`
- Check firewall allows port 3306

### "API returns 404"
- Ensure Nginx proxy passes to correct port
- Check backend is running: `pm2 status`
- Verify `/api/trpc/ping` responds

### "Frontend shows blank page"
- Check browser console for errors
- Ensure `index.html` is served for all routes (SPA routing)
- Verify API calls reach the backend

### "QR codes don't work"
- The QR URL must match your actual domain
- Format: `https://your-domain.com/menu/{table-qr-token}`

---

## 10. SSL / HTTPS

Use Let's Encrypt (free):
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

Or Cloudflare (free SSL + CDN):
1. Point your domain to Cloudflare
2. Enable "Full (Strict)" SSL mode
3. Set origin certificate in Nginx

---

## Need Help?

Check logs:
```bash
# Backend logs
pm2 logs djanam-api

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Database logs
sudo tail -f /var/log/mysql/error.log
```
