<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use PDO;

class CheckTriggers extends Command
{
    protected $signature = 'triggers:check';
    protected $description = 'Check if database triggers are properly set up';

    public function handle()
    {
        $this->info('Checking database triggers...');

        try {
            // Check database connection
            DB::connection()->getPdo();
            $this->info('✓ Database connection successful');

            // Check if migration was run
            $migration = '2025_12_06_075854_create_database_triggers';
            $migrationRecord = DB::table('migrations')
                ->where('migration', $migration)
                ->first();

            if (!$migrationRecord) {
                $this->error("❌ Migration '$migration' not found in migrations table");
                $this->info('Try running: php artisan migrate');
                return 1;
            }

            $this->info("✓ Migration '$migration' was run in batch {$migrationRecord->batch}");

            // Get all triggers
            $triggers = DB::select('SHOW TRIGGERS');
            $triggerNames = array_column($triggers, 'Trigger');

            if (empty($triggers)) {
                $this->warn('⚠ No triggers found in the database');
                $this->info('Attempting to re-run the migration...');
                
                $exitCode = $this->call('migrate:refresh', [
                    '--path' => 'database/migrations/2025_12_06_075854_create_database_triggers.php',
                    '--force' => true,
                ]);

                if ($exitCode === 0) {
                    $this->info('Migration re-run successfully');
                    $triggers = DB::select('SHOW TRIGGERS');
                    $triggerNames = array_column($triggers, 'Trigger');
                } else {
                    $this->error('Failed to re-run migration');
                    return 1;
                }
            }

            if (empty($triggers)) {
                $this->error('❌ Still no triggers found after re-running migration');
                $this->info('There might be an error in the migration file');
                return 1;
            }

            $this->info('\nFound the following triggers:');
            $this->table(
                ['Name', 'Event', 'Table', 'Timing'],
                array_map(function($trigger) {
                    return [
                        $trigger->Trigger,
                        $trigger->Event,
                        $trigger->Table,
                        $trigger->Timing
                    ];
                }, $triggers)
            );

            // Check for expected triggers
            $expectedTriggers = [
                'trigger_log_user_insert',
                'trigger_prevent_admin_delete',
                'trigger_log_service_update',
                'trigger_log_company_profile_change',
                'trigger_log_booking_insert',
                'trigger_log_booking_update',
                'trigger_prevent_booking_delete'
            ];

            $missingTriggers = array_diff($expectedTriggers, $triggerNames);

            if (!empty($missingTriggers)) {
                $this->warn('\n⚠ The following expected triggers are missing:');
                foreach ($missingTriggers as $missing) {
                    $this->line("- $missing");
                }
                $this->info('\nTry running: php artisan migrate:fresh --seed');
            } else {
                $this->info('\n✓ All expected triggers are present');
            }

            return 0;

        } catch (\Exception $e) {
            $this->error('❌ Error: ' . $e->getMessage());
            $this->line('');
            $this->info('Make sure your database is running and the .env file is properly configured.');
            return 1;
        }
    }
}
