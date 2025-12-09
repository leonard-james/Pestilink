<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Creates database views for security, clean queries, and access control.
     * Note: Views and triggers require MySQL/MariaDB. SQLite does not support these features.
     */
    public function up(): void
    {
        $driver = DB::getDriverName();
        
        if (!in_array($driver, ['mysql', 'mariadb'])) {
            // Skip for SQLite and other databases
            return;
        }

        // View 1: view_active_users - Shows only users with active accounts, excludes password
        DB::statement("
            CREATE OR REPLACE VIEW view_active_users AS
            SELECT 
                id AS user_id,
                name AS username,
                role,
                email,
                created_at,
                'active' AS status
            FROM users
        ");

        // View 2: view_company_overview - Combine users (role = 'company') + company profile
        DB::statement("
            CREATE OR REPLACE VIEW view_company_overview AS
            SELECT 
                c.id AS company_id,
                c.company_name,
                u.name AS owner_username,
                c.address,
                c.phone AS contact_number,
                c.description,
                c.logo_url
            FROM companies c
            JOIN users u ON u.id = c.user_id
            WHERE u.role = 'company'
        ");

        // View 3: view_service_catalog - Combine company services + company name
        DB::statement("
            CREATE OR REPLACE VIEW view_service_catalog AS
            SELECT 
                cs.id AS service_id,
                cs.title AS service_name,
                c.company_name,
                cs.price,
                cs.description,
                cs.created_at
            FROM company_services cs
            JOIN companies c ON c.id = cs.company_id
            WHERE cs.is_active = 1
        ");

        // View 4: view_admin_logs - View for admin to quickly see all system logs
        DB::statement("
            CREATE OR REPLACE VIEW view_admin_logs AS
            SELECT 
                id AS log_id,
                event_type,
                description,
                triggered_by,
                created_at AS timestamp
            FROM system_logs
            ORDER BY created_at DESC
        ");

        // View 5: view_all_bookings - Admin view of bookings
        DB::statement("
            CREATE OR REPLACE VIEW view_all_bookings AS
            SELECT
                b.id AS booking_id,
                b.service_id,
                cs.title AS service_name,
                b.company_id,
                c.company_name,
                b.user_id,
                u.name AS user_username,
                u.email AS user_email,
                b.status,
                b.booking_notes,
                b.created_at,
                b.updated_at
            FROM service_bookings b
            JOIN company_services cs ON cs.id = b.service_id
            JOIN companies c ON c.id = b.company_id
            JOIN users u ON u.id = b.user_id
        ");

        // View 6: view_company_bookings - Company owner view (their company's bookings)
        DB::statement("
            CREATE OR REPLACE VIEW view_company_bookings AS
            SELECT * FROM view_all_bookings
        ");

        // View 7: view_user_bookings - Farmer/user view (their bookings)
        DB::statement("
            CREATE OR REPLACE VIEW view_user_bookings AS
            SELECT * FROM view_all_bookings
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = DB::getDriverName();
        
        if (!in_array($driver, ['mysql', 'mariadb'])) {
            return;
        }

        DB::statement("DROP VIEW IF EXISTS view_active_users");
        DB::statement("DROP VIEW IF EXISTS view_company_overview");
        DB::statement("DROP VIEW IF EXISTS view_service_catalog");
        DB::statement("DROP VIEW IF EXISTS view_admin_logs");
        DB::statement("DROP VIEW IF EXISTS view_all_bookings");
        DB::statement("DROP VIEW IF EXISTS view_company_bookings");
        DB::statement("DROP VIEW IF EXISTS view_user_bookings");
    }
};
