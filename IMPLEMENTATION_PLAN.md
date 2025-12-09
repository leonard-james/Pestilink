# Pestilink System Update - Implementation Plan

## Critical Issues to Fix First

### 1. Database Connection Error
**Error:** `SQLSTATE[HY000] [2002] No connection could be made because the target machine actively refused it`

**Solution Options:**
- **Option A:** Start MySQL service on Windows
  ```powershell
  # Check if MySQL is running
  Get-Service -Name MySQL* | Select-Object Name, Status
  
  # Start MySQL if stopped
  Start-Service MySQL80  # or your MySQL service name
  ```

- **Option B:** Switch to SQLite temporarily (for development)
  - Change in `.env`: `DB_CONNECTION=sqlite`
  - Note: Views and triggers require MySQL, so switch back for production

### 2. Cloudinary API Secret Missing
**Action Required:** Add your Cloudinary API Secret to `.env`:
```
CLOUDINARY_API_SECRET=your_actual_api_secret_here
```

## Credentials Added to .env

✅ **Roboflow:**
- ROBOFLOW_API_KEY=UtuiZMh0j2N92TdgMJg8
- ROBOFLOW_WORKSPACE=markjohn
- ROBOFLOW_WORKFLOW_ID=detect-and-classify-4
- ROBOFLOW_VERSION=1

✅ **Cloudinary:**
- CLOUDINARY_CLOUD_NAME=dwovgqzsk
- CLOUDINARY_API_KEY=772424885657761
- ⚠️ CLOUDINARY_API_SECRET=**NEEDS TO BE ADDED**

## System Updates Required

### Phase 1: Authentication & Roles (HIGH PRIORITY)
1. ✅ Remove role selector from login page
2. ✅ Add role selector to signup page (farmer/company only)
3. ✅ Create hardcoded admin accounts in seeder
4. ✅ Update login redirect logic based on role
5. ✅ Implement role-based middleware

### Phase 2: Database Schema Updates
1. ✅ Create system_logs table
2. ✅ Create views (view_active_users, view_company_overview, view_service_catalog)
3. ✅ Create triggers (log user insert, prevent admin delete, log service updates)
4. ✅ Create booking tables (service_bookings, notifications, booking_audit)
5. ✅ Create booking views and triggers

### Phase 3: Cloudinary Integration
1. ✅ Pest detection images → `pest_detection` folder
2. ✅ Company logos → `company_image` folder
3. ✅ Service images → Cloudinary storage

### Phase 4: Dashboards & Pages
1. ✅ Farmer Dashboard (already exists, verify)
2. ✅ Company Dashboard (add service management, profile, inquiries)
3. ✅ Admin Dashboard (user management, company approval, logs)

### Phase 5: Booking System
1. ✅ Create booking endpoints
2. ✅ Create booking pages (farmer, company, admin)
3. ✅ Implement notifications system

## Next Steps

1. **IMMEDIATE:** Fix database connection (start MySQL or switch to SQLite)
2. **IMMEDIATE:** Add Cloudinary API Secret to .env
3. Then proceed with system updates in phases






