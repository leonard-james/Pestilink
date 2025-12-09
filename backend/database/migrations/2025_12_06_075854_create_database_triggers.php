<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Creates database triggers for system security and audit logging.
     * Note: Triggers require MySQL/MariaDB. SQLite does not support triggers.
     */
    public function up(): void
    {
        $driver = DB::getDriverName();
        
        if (!in_array($driver, ['mysql', 'mariadb'])) {
            // Skip for SQLite and other databases
            return;
        }

        // Trigger 1: Log user creation
        DB::statement("
            DROP TRIGGER IF EXISTS trigger_log_user_insert
        ");

        DB::statement("
            CREATE TRIGGER trigger_log_user_insert
            AFTER INSERT ON users
            FOR EACH ROW
            BEGIN
                INSERT INTO system_logs (event_type, description, triggered_by, created_at)
                VALUES ('USER_CREATED', CONCAT('User ', NEW.name, ' (', NEW.email, ') registered with role ', NEW.role), NEW.name, NOW());
            END
        ");

        // Trigger 2: Prevent admin deletion
        DB::statement("
            DROP TRIGGER IF EXISTS trigger_prevent_admin_delete
        ");

        DB::statement("
            CREATE TRIGGER trigger_prevent_admin_delete
            BEFORE DELETE ON users
            FOR EACH ROW
            BEGIN
                IF OLD.role = 'admin' THEN
                    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Admin accounts cannot be deleted';
                END IF;
            END
        ");

        // Trigger 3: Log service updates
        DB::statement("
            DROP TRIGGER IF EXISTS trigger_log_service_update
        ");

        DB::statement("
            CREATE TRIGGER trigger_log_service_update
            AFTER UPDATE ON company_services
            FOR EACH ROW
            BEGIN
                IF OLD.title != NEW.title OR OLD.price != NEW.price OR OLD.is_active != NEW.is_active THEN
                    INSERT INTO system_logs (event_type, description, triggered_by, created_at)
                    VALUES ('SERVICE_UPDATED', CONCAT('Service ID ', NEW.id, ' updated for company ', NEW.company_id), 
                            (SELECT name FROM users WHERE id = (SELECT user_id FROM companies WHERE id = NEW.company_id)), NOW());
                END IF;
            END
        ");

        // Trigger 4: Log company profile changes
        DB::statement("
            DROP TRIGGER IF EXISTS trigger_log_company_profile_change
        ");

        DB::statement("
            CREATE TRIGGER trigger_log_company_profile_change
            AFTER UPDATE ON companies
            FOR EACH ROW
            BEGIN
                IF OLD.company_name != NEW.company_name OR OLD.is_verified != NEW.is_verified THEN
                    INSERT INTO system_logs (event_type, description, triggered_by, created_at)
                    VALUES ('COMPANY_PROFILE_UPDATED', CONCAT('Company profile updated for ', NEW.company_name), 
                            (SELECT name FROM users WHERE id = NEW.user_id), NOW());
                END IF;
            END
        ");

        // Trigger 5: Log booking creation + notify admin + notify company owner
        DB::statement("
            DROP TRIGGER IF EXISTS trigger_log_booking_insert
        ");

        DB::statement("
            CREATE TRIGGER trigger_log_booking_insert
            AFTER INSERT ON service_bookings
            FOR EACH ROW
            BEGIN
                DECLARE company_owner_username VARCHAR(150);
                
                -- Log the booking creation
                INSERT INTO system_logs (event_type, description, triggered_by, created_at)
                VALUES ('BOOKING_CREATED', CONCAT('Booking ID ', NEW.id, ' for service ', NEW.service_id, ' created by user_id ', NEW.user_id), 
                        (SELECT name FROM users WHERE id = NEW.user_id), NOW());
                
                -- Insert audit initial row
                INSERT INTO booking_audit (booking_id, old_status, new_status, changed_by, created_at)
                VALUES (NEW.id, NULL, NEW.status, (SELECT name FROM users WHERE id = NEW.user_id), NOW());
                
                -- Get company owner username
                SELECT u.name INTO company_owner_username
                FROM users u
                JOIN companies c ON c.user_id = u.id
                WHERE c.id = NEW.company_id
                LIMIT 1;
                
                -- Notify admin(s) - hardcoded admin usernames
                INSERT INTO notifications (recipient_username, type, payload, created_at)
                VALUES 
                    ('leo', 'BOOKING_CREATED', JSON_OBJECT('booking_id', NEW.id, 'service_id', NEW.service_id), NOW()),
                    ('fola', 'BOOKING_CREATED', JSON_OBJECT('booking_id', NEW.id, 'service_id', NEW.service_id), NOW()),
                    ('lloyd', 'BOOKING_CREATED', JSON_OBJECT('booking_id', NEW.id, 'service_id', NEW.service_id), NOW()),
                    ('mj', 'BOOKING_CREATED', JSON_OBJECT('booking_id', NEW.id, 'service_id', NEW.service_id), NOW());
                
                -- Notify company owner
                IF company_owner_username IS NOT NULL THEN
                    INSERT INTO notifications (recipient_username, type, payload, created_at)
                    VALUES (company_owner_username, 'BOOKING_CREATED', 
                            JSON_OBJECT('booking_id', NEW.id, 'service_id', NEW.service_id, 'user_id', NEW.user_id), NOW());
                END IF;
            END
        ");

        // Trigger 6: Log booking updates (status changes) + notify admin/company/user
        DB::statement("
            DROP TRIGGER IF EXISTS trigger_log_booking_update
        ");

        DB::statement("
            CREATE TRIGGER trigger_log_booking_update
            AFTER UPDATE ON service_bookings
            FOR EACH ROW
            BEGIN
                DECLARE company_owner_username VARCHAR(150);
                DECLARE booking_user_username VARCHAR(150);
                
                -- Only log when status changes or booking_notes changed
                IF OLD.status != NEW.status OR OLD.booking_notes != NEW.booking_notes THEN
                    -- Log the update
                    INSERT INTO system_logs (event_type, description, triggered_by, created_at)
                    VALUES ('BOOKING_UPDATED', CONCAT('Booking ID ', NEW.id, ' status changed from ', OLD.status, ' to ', NEW.status), 
                            (SELECT name FROM users WHERE id = NEW.user_id), NOW());
                    
                    -- Add to booking_audit
                    INSERT INTO booking_audit (booking_id, old_status, new_status, changed_by, created_at)
                    VALUES (NEW.id, OLD.status, NEW.status, (SELECT name FROM users WHERE id = NEW.user_id), NOW());
                    
                    -- Get company owner username
                    SELECT u.name INTO company_owner_username
                    FROM users u
                    JOIN companies c ON c.user_id = u.id
                    WHERE c.id = NEW.company_id
                    LIMIT 1;
                    
                    -- Get booking user username
                    SELECT name INTO booking_user_username
                    FROM users
                    WHERE id = NEW.user_id
                    LIMIT 1;
                    
                    -- Notify admin(s)
                    INSERT INTO notifications (recipient_username, type, payload, created_at)
                    VALUES 
                        ('leo', 'BOOKING_UPDATED', JSON_OBJECT('booking_id', NEW.id, 'old_status', OLD.status, 'new_status', NEW.status), NOW()),
                        ('fola', 'BOOKING_UPDATED', JSON_OBJECT('booking_id', NEW.id, 'old_status', OLD.status, 'new_status', NEW.status), NOW()),
                        ('lloyd', 'BOOKING_UPDATED', JSON_OBJECT('booking_id', NEW.id, 'old_status', OLD.status, 'new_status', NEW.status), NOW()),
                        ('mj', 'BOOKING_UPDATED', JSON_OBJECT('booking_id', NEW.id, 'old_status', OLD.status, 'new_status', NEW.status), NOW());
                    
                    -- Notify company owner
                    IF company_owner_username IS NOT NULL THEN
                        INSERT INTO notifications (recipient_username, type, payload, created_at)
                        VALUES (company_owner_username, 'BOOKING_UPDATED', 
                                JSON_OBJECT('booking_id', NEW.id, 'old_status', OLD.status, 'new_status', NEW.status), NOW());
                    END IF;
                    
                    -- Notify booking user
                    IF booking_user_username IS NOT NULL THEN
                        INSERT INTO notifications (recipient_username, type, payload, created_at)
                        VALUES (booking_user_username, 'BOOKING_UPDATED', 
                                JSON_OBJECT('booking_id', NEW.id, 'old_status', OLD.status, 'new_status', NEW.status), NOW());
                    END IF;
                END IF;
            END
        ");

        // Trigger 7: Prevent deletion of active bookings
        DB::statement("
            DROP TRIGGER IF EXISTS trigger_prevent_booking_delete
        ");

        DB::statement("
            CREATE TRIGGER trigger_prevent_booking_delete
            BEFORE DELETE ON service_bookings
            FOR EACH ROW
            BEGIN
                IF OLD.status != 'cancelled' THEN
                    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot delete active booking. Cancel booking first or use admin override.';
                END IF;
            END
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

        DB::statement("DROP TRIGGER IF EXISTS trigger_log_user_insert");
        DB::statement("DROP TRIGGER IF EXISTS trigger_prevent_admin_delete");
        DB::statement("DROP TRIGGER IF EXISTS trigger_log_service_update");
        DB::statement("DROP TRIGGER IF EXISTS trigger_log_company_profile_change");
        DB::statement("DROP TRIGGER IF EXISTS trigger_log_booking_insert");
        DB::statement("DROP TRIGGER IF EXISTS trigger_log_booking_update");
        DB::statement("DROP TRIGGER IF EXISTS trigger_prevent_booking_delete");
    }
};
