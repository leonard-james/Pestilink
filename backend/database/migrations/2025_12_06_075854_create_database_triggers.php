<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Creates database triggers for system security and audit logging.
     * SQLite does not support the audit and notification triggers used here.
     */
    public function up(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'pgsql') {
            $this->createPostgresTriggers();
            return;
        }

        if (!in_array($driver, ['mysql', 'mariadb'])) {
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

        if ($driver === 'pgsql') {
            $triggers = [
                'trigger_log_user_insert' => 'users',
                'trigger_prevent_admin_delete' => 'users',
                'trigger_log_service_update' => 'company_services',
                'trigger_log_company_profile_change' => 'companies',
                'trigger_log_booking_insert' => 'service_bookings',
                'trigger_log_booking_update' => 'service_bookings',
                'trigger_prevent_booking_delete' => 'service_bookings',
            ];

            foreach ($triggers as $trigger => $table) {
                DB::statement("DROP TRIGGER IF EXISTS {$trigger} ON {$table}");
                DB::statement("DROP FUNCTION IF EXISTS {$trigger}_fn()");
            }

            return;
        }

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

    private function createPostgresTriggers(): void
    {
        DB::unprepared(<<<'SQL'
            CREATE OR REPLACE FUNCTION trigger_log_user_insert_fn()
            RETURNS trigger LANGUAGE plpgsql AS $$
            BEGIN
                INSERT INTO system_logs (event_type, description, triggered_by, created_at)
                VALUES (
                    'USER_CREATED',
                    format('User %s (%s) registered with role %s', NEW.name, NEW.email, NEW.role),
                    NEW.name,
                    CURRENT_TIMESTAMP
                );
                RETURN NEW;
            END;
            $$
        SQL);
        DB::statement('DROP TRIGGER IF EXISTS trigger_log_user_insert ON users');
        DB::statement('CREATE TRIGGER trigger_log_user_insert AFTER INSERT ON users FOR EACH ROW EXECUTE FUNCTION trigger_log_user_insert_fn()');

        DB::unprepared(<<<'SQL'
            CREATE OR REPLACE FUNCTION trigger_prevent_admin_delete_fn()
            RETURNS trigger LANGUAGE plpgsql AS $$
            BEGIN
                IF OLD.role = 'admin' THEN
                    RAISE EXCEPTION 'Admin accounts cannot be deleted';
                END IF;
                RETURN OLD;
            END;
            $$
        SQL);
        DB::statement('DROP TRIGGER IF EXISTS trigger_prevent_admin_delete ON users');
        DB::statement('CREATE TRIGGER trigger_prevent_admin_delete BEFORE DELETE ON users FOR EACH ROW EXECUTE FUNCTION trigger_prevent_admin_delete_fn()');

        DB::unprepared(<<<'SQL'
            CREATE OR REPLACE FUNCTION trigger_log_service_update_fn()
            RETURNS trigger LANGUAGE plpgsql AS $$
            DECLARE
                actor_name VARCHAR(255);
            BEGIN
                IF OLD.title IS DISTINCT FROM NEW.title
                    OR OLD.price IS DISTINCT FROM NEW.price
                    OR OLD.is_active IS DISTINCT FROM NEW.is_active THEN
                    SELECT u.name INTO actor_name
                    FROM users u
                    JOIN companies c ON c.user_id = u.id
                    WHERE c.id = NEW.company_id;

                    INSERT INTO system_logs (event_type, description, triggered_by, created_at)
                    VALUES (
                        'SERVICE_UPDATED',
                        format('Service ID %s updated for company %s', NEW.id, NEW.company_id),
                        actor_name,
                        CURRENT_TIMESTAMP
                    );
                END IF;
                RETURN NEW;
            END;
            $$
        SQL);
        DB::statement('DROP TRIGGER IF EXISTS trigger_log_service_update ON company_services');
        DB::statement('CREATE TRIGGER trigger_log_service_update AFTER UPDATE ON company_services FOR EACH ROW EXECUTE FUNCTION trigger_log_service_update_fn()');

        DB::unprepared(<<<'SQL'
            CREATE OR REPLACE FUNCTION trigger_log_company_profile_change_fn()
            RETURNS trigger LANGUAGE plpgsql AS $$
            DECLARE
                actor_name VARCHAR(255);
            BEGIN
                IF OLD.company_name IS DISTINCT FROM NEW.company_name
                    OR OLD.is_verified IS DISTINCT FROM NEW.is_verified THEN
                    SELECT name INTO actor_name FROM users WHERE id = NEW.user_id;

                    INSERT INTO system_logs (event_type, description, triggered_by, created_at)
                    VALUES (
                        'COMPANY_PROFILE_UPDATED',
                        format('Company profile updated for %s', NEW.company_name),
                        actor_name,
                        CURRENT_TIMESTAMP
                    );
                END IF;
                RETURN NEW;
            END;
            $$
        SQL);
        DB::statement('DROP TRIGGER IF EXISTS trigger_log_company_profile_change ON companies');
        DB::statement('CREATE TRIGGER trigger_log_company_profile_change AFTER UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION trigger_log_company_profile_change_fn()');

        DB::unprepared(<<<'SQL'
            CREATE OR REPLACE FUNCTION trigger_log_booking_insert_fn()
            RETURNS trigger LANGUAGE plpgsql AS $$
            DECLARE
                company_owner_username VARCHAR(255);
            BEGIN
                INSERT INTO system_logs (event_type, description, triggered_by, created_at)
                VALUES (
                    'BOOKING_CREATED',
                    format('Booking ID %s for service %s created by user_id %s', NEW.id, NEW.service_id, NEW.user_id),
                    (SELECT name FROM users WHERE id = NEW.user_id),
                    CURRENT_TIMESTAMP
                );

                INSERT INTO booking_audit (booking_id, old_status, new_status, changed_by, created_at)
                VALUES (
                    NEW.id,
                    NULL,
                    NEW.status,
                    (SELECT name FROM users WHERE id = NEW.user_id),
                    CURRENT_TIMESTAMP
                );

                SELECT u.name INTO company_owner_username
                FROM users u
                JOIN companies c ON c.user_id = u.id
                WHERE c.id = NEW.company_id
                LIMIT 1;

                INSERT INTO notifications (recipient_username, type, payload, created_at)
                SELECT admin_name, 'BOOKING_CREATED',
                    json_build_object('booking_id', NEW.id, 'service_id', NEW.service_id),
                    CURRENT_TIMESTAMP
                FROM unnest(ARRAY['leo', 'fola', 'lloyd', 'mj']) AS admins(admin_name);

                IF company_owner_username IS NOT NULL THEN
                    INSERT INTO notifications (recipient_username, type, payload, created_at)
                    VALUES (
                        company_owner_username,
                        'BOOKING_CREATED',
                        json_build_object('booking_id', NEW.id, 'service_id', NEW.service_id, 'user_id', NEW.user_id),
                        CURRENT_TIMESTAMP
                    );
                END IF;

                RETURN NEW;
            END;
            $$
        SQL);
        DB::statement('DROP TRIGGER IF EXISTS trigger_log_booking_insert ON service_bookings');
        DB::statement('CREATE TRIGGER trigger_log_booking_insert AFTER INSERT ON service_bookings FOR EACH ROW EXECUTE FUNCTION trigger_log_booking_insert_fn()');

        DB::unprepared(<<<'SQL'
            CREATE OR REPLACE FUNCTION trigger_log_booking_update_fn()
            RETURNS trigger LANGUAGE plpgsql AS $$
            DECLARE
                company_owner_username VARCHAR(255);
                booking_user_username VARCHAR(255);
                notification_payload JSON;
            BEGIN
                IF OLD.status IS DISTINCT FROM NEW.status
                    OR OLD.booking_notes IS DISTINCT FROM NEW.booking_notes THEN
                    INSERT INTO system_logs (event_type, description, triggered_by, created_at)
                    VALUES (
                        'BOOKING_UPDATED',
                        format('Booking ID %s status changed from %s to %s', NEW.id, OLD.status, NEW.status),
                        (SELECT name FROM users WHERE id = NEW.user_id),
                        CURRENT_TIMESTAMP
                    );

                    INSERT INTO booking_audit (booking_id, old_status, new_status, changed_by, created_at)
                    VALUES (
                        NEW.id,
                        OLD.status,
                        NEW.status,
                        (SELECT name FROM users WHERE id = NEW.user_id),
                        CURRENT_TIMESTAMP
                    );

                    SELECT u.name INTO company_owner_username
                    FROM users u
                    JOIN companies c ON c.user_id = u.id
                    WHERE c.id = NEW.company_id
                    LIMIT 1;

                    SELECT name INTO booking_user_username FROM users WHERE id = NEW.user_id LIMIT 1;

                    notification_payload := json_build_object(
                        'booking_id', NEW.id,
                        'old_status', OLD.status,
                        'new_status', NEW.status
                    );

                    INSERT INTO notifications (recipient_username, type, payload, created_at)
                    SELECT admin_name, 'BOOKING_UPDATED', notification_payload, CURRENT_TIMESTAMP
                    FROM unnest(ARRAY['leo', 'fola', 'lloyd', 'mj']) AS admins(admin_name);

                    IF company_owner_username IS NOT NULL THEN
                        INSERT INTO notifications (recipient_username, type, payload, created_at)
                        VALUES (company_owner_username, 'BOOKING_UPDATED', notification_payload, CURRENT_TIMESTAMP);
                    END IF;

                    IF booking_user_username IS NOT NULL THEN
                        INSERT INTO notifications (recipient_username, type, payload, created_at)
                        VALUES (booking_user_username, 'BOOKING_UPDATED', notification_payload, CURRENT_TIMESTAMP);
                    END IF;
                END IF;
                RETURN NEW;
            END;
            $$
        SQL);
        DB::statement('DROP TRIGGER IF EXISTS trigger_log_booking_update ON service_bookings');
        DB::statement('CREATE TRIGGER trigger_log_booking_update AFTER UPDATE ON service_bookings FOR EACH ROW EXECUTE FUNCTION trigger_log_booking_update_fn()');

        DB::unprepared(<<<'SQL'
            CREATE OR REPLACE FUNCTION trigger_prevent_booking_delete_fn()
            RETURNS trigger LANGUAGE plpgsql AS $$
            BEGIN
                IF OLD.status <> 'cancelled' THEN
                    RAISE EXCEPTION 'Cannot delete active booking. Cancel booking first or use admin override.';
                END IF;
                RETURN OLD;
            END;
            $$
        SQL);
        DB::statement('DROP TRIGGER IF EXISTS trigger_prevent_booking_delete ON service_bookings');
        DB::statement('CREATE TRIGGER trigger_prevent_booking_delete BEFORE DELETE ON service_bookings FOR EACH ROW EXECUTE FUNCTION trigger_prevent_booking_delete_fn()');
    }
};
