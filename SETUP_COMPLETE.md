# Pestilink System Setup - Complete Implementation

## ✅ Completed Components

### 1. Database Migrations
- ✅ `2025_12_06_080000_create_system_logs_table.php` - System logging table
- ✅ `2025_12_06_080100_create_notifications_table.php` - Notifications table
- ✅ `2025_12_06_080200_create_booking_audit_table.php` - Booking audit trail
- ✅ `2025_12_06_075735_create_service_bookings_table.php` - Service bookings
- ✅ `2025_12_06_075849_create_database_views.php` - Database views
- ✅ `2025_12_06_075854_create_database_triggers.php` - Database triggers

### 2. Models
- ✅ `ServiceBooking.php` - Booking model
- ✅ `CompanyService.php` - Company service model (alias for Service)
- ✅ `User.php` - Already has role methods (isFarmer, isCompany, isAdmin)

### 3. Controllers
- ✅ `BookingController.php` - Full booking management
- ✅ `NotificationController.php` - Notification handling
- ✅ `PestController.php` - Updated with Cloudinary integration
- ✅ `ServiceController.php` - Service management

### 4. Middleware
- ✅ `EnsureUserIsFarmer.php` - Farmer access control
- ✅ `EnsureUserIsCompany.php` - Company access control
- ✅ `EnsureUserIsAdmin.php` - Admin access control

### 5. Seeders
- ✅ `AdminSeeder.php` - Hardcoded admin accounts (leo, fola, lloyd, mj)

### 6. Configuration
- ✅ `config/cloudinary.php` - Cloudinary configuration
- ✅ `.env` - Roboflow credentials added
- ⚠️ `.env` - **NEEDS**: `CLOUDINARY_API_SECRET`

### 7. Routes
- ✅ All booking routes configured
- ✅ All notification routes configured
- ✅ Role-based middleware applied

## 🚀 Setup Instructions

### Step 1: Database Setup

1. **Create the database:**
   ```sql
   CREATE DATABASE IF NOT EXISTS pestilink CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Verify MySQL is running:**
   ```powershell
   Get-Service -Name MySQL*
   ```

3. **Test connection:**
   ```bash
   php artisan migrate:status
   ```

### Step 2: Run Migrations

```bash
php artisan migrate
```

This will create:
- All tables (users, companies, services, bookings, notifications, logs, etc.)
- All views (view_active_users, view_company_overview, etc.)
- All triggers (logging, notifications, admin protection)

### Step 3: Seed Admin Accounts

```bash
php artisan db:seed --class=AdminSeeder
```

This creates 4 admin accounts:
- **leo** / password: `password`
- **fola** / password: `password`
- **lloyd** / password: `password`
- **mj** / password: `password`

### Step 4: Add Cloudinary API Secret

Edit `backend/.env` and add:
```
CLOUDINARY_API_SECRET=your_actual_api_secret_here
```

### Step 5: Verify Setup

```bash
# Check migrations
php artisan migrate:status

# Test API (if server is running)
curl http://localhost:8000/api/services
```

## 📋 API Endpoints

### Authentication
- `POST /api/auth/login` - Login (no role selection)
- `POST /api/auth/register` - Register (role selection: farmer/company)
- `POST /api/auth/logout` - Logout (auth required)
- `GET /api/auth/profile` - Get profile (auth required)

### Bookings (Auth Required)
- `POST /api/bookings` - Create booking (Farmer only)
- `GET /api/bookings/me` - My bookings (Farmer only)
- `GET /api/bookings/company` - Company bookings (Company only)
- `GET /api/bookings/all` - All bookings (Admin only)
- `PATCH /api/bookings/{id}/status` - Update status (Company/Admin)
- `GET /api/bookings/{id}/audit` - Audit trail (Admin only)

### Notifications (Auth Required)
- `GET /api/notifications` - Get notifications
- `PATCH /api/notifications/{id}/read` - Mark as read
- `PATCH /api/notifications/read-all` - Mark all as read

### Services
- `GET /api/services` - List all services (public)
- `GET /api/services/suggest?pest={name}` - Suggest services (public)
- `GET /api/company/services` - Company's services (Company only)
- `POST /api/company/services` - Create service (Company only)

### Pest Classification
- `POST /api/pest/classify` - Classify pest image (uploads to Cloudinary)

## 🔐 Role-Based Access

### Farmer
- Can create bookings
- Can view their bookings
- Can view services
- Can use pest classification

### Company
- Can manage their services
- Can view their company's bookings
- Can update booking status (their company only)
- Can view notifications

### Admin
- Full access to all bookings
- Can view all users
- Can view system logs
- Can override booking status
- Can view audit trails

## 🗄️ Database Features

### Views
- `view_active_users` - Active users (no password)
- `view_company_overview` - Company listings
- `view_service_catalog` - Service catalog
- `view_admin_logs` - System logs
- `view_all_bookings` - All bookings
- `view_company_bookings` - Company bookings
- `view_user_bookings` - User bookings

### Triggers
- `trigger_log_user_insert` - Logs user creation
- `trigger_prevent_admin_delete` - Prevents admin deletion
- `trigger_log_service_update` - Logs service changes
- `trigger_log_company_profile_change` - Logs company updates
- `trigger_log_booking_insert` - Logs booking creation + notifications
- `trigger_log_booking_update` - Logs booking updates + notifications
- `trigger_prevent_booking_delete` - Prevents active booking deletion

### ACID Compliance
- All write operations use transactions
- Foreign key constraints enforced
- Isolation levels set appropriately
- Durability ensured with InnoDB

## ⚠️ Important Notes

1. **Database Connection**: Ensure MySQL is running before running migrations
2. **Cloudinary Secret**: Must be added to `.env` for image uploads to work
3. **Admin Accounts**: Cannot be created through registration, only via seeder
4. **Booking Deletion**: Active bookings cannot be deleted (must be cancelled first)
5. **Notifications**: Created by triggers, actual email/push delivery requires background worker

## 🎯 Next Steps (Frontend)

1. Create booking pages for Farmer dashboard
2. Create booking management page for Company dashboard
3. Create booking management page for Admin dashboard
4. Add notification bell/indicator to all dashboards
5. Update Company dashboard with service management UI
6. Update Admin dashboard with user management UI

## 📝 Testing Checklist

- [ ] Database connection works
- [ ] Migrations run successfully
- [ ] Admin accounts seeded
- [ ] Can login as admin (leo/password)
- [ ] Can register as farmer
- [ ] Can register as company
- [ ] Can create booking (farmer)
- [ ] Can view bookings (company)
- [ ] Can update booking status (company)
- [ ] Notifications appear after booking creation
- [ ] Pest classification uploads to Cloudinary
- [ ] Services can be created by company

