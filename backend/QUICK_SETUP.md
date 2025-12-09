# Quick Setup Guide - Next Steps

## ✅ Step 1: Verify MySQL is Running

Check if MySQL service is running:
```powershell
Get-Service -Name MySQL*
```

If it shows "Stopped", start it:
```powershell
Start-Service MySQL80
# OR
Start-Service MySQL
# OR (if different name)
Start-Service MySQL57
```

## ✅ Step 2: Create Database

**Option A: Using MySQL Command Line**
```bash
mysql -u root -p
```
Then run:
```sql
CREATE DATABASE IF NOT EXISTS pestilink CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

**Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Run this SQL:
```sql
CREATE DATABASE IF NOT EXISTS pestilink CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**Option C: Using phpMyAdmin**
1. Open phpMyAdmin
2. Click "New" database
3. Name: `pestilink`
4. Collation: `utf8mb4_unicode_ci`
5. Click "Create"

## ✅ Step 3: Test Database Connection

```bash
php artisan migrate:status
```

If you see a list of migrations (or "Nothing to migrate"), the connection works!

## ✅ Step 4: Run Migrations

```bash
php artisan migrate
```

This will create all tables, views, and triggers.

## ✅ Step 5: Seed Admin Accounts

```bash
php artisan db:seed --class=AdminSeeder
```

This creates 4 admin accounts:
- **leo** / password: `password`
- **fola** / password: `password`
- **lloyd** / password: `password`
- **mj** / password: `password`

## ✅ Step 6: Verify Everything Works

Test the API:
```bash
# Start Laravel server (if not running)
php artisan serve

# In another terminal, test login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"leo@admin.pestilink","password":"password"}'
```

## 🔧 Troubleshooting

### If MySQL connection still fails:

1. **Check MySQL port:**
   - Default is 3306
   - Verify in `.env`: `DB_PORT=3306`

2. **Check if MySQL is listening:**
   ```powershell
   netstat -an | findstr 3306
   ```

3. **Try connecting manually:**
   ```bash
   mysql -u root -p -h 127.0.0.1 -P 3306
   ```

4. **Check firewall:**
   - Windows Firewall might be blocking MySQL
   - Allow MySQL through firewall if needed

5. **Alternative: Use SQLite temporarily:**
   - Change in `.env`: `DB_CONNECTION=sqlite`
   - Note: Views and triggers won't work with SQLite



