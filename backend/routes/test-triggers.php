<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

Route::get('/test/triggers', function () {
    try {
        // Check database connection
        DB::connection()->getPdo();
        
        $triggers = match (DB::getDriverName()) {
            'mysql', 'mariadb' => DB::select('SHOW TRIGGERS'),
            'pgsql' => DB::select("
                SELECT
                    t.tgname AS \"Trigger\",
                    pg_get_triggerdef(t.oid) AS \"Event\",
                    c.relname AS \"Table\",
                    CASE WHEN (t.tgtype & 2) = 2 THEN 'BEFORE' ELSE 'AFTER' END AS \"Timing\"
                FROM pg_trigger t
                JOIN pg_class c ON c.oid = t.tgrelid
                WHERE NOT t.tgisinternal
            "),
            default => [],
        };
        
        if (empty($triggers)) {
            return response()->json([
                'status' => 'error',
                'message' => 'No triggers found in the database',
                'next_steps' => 'You may need to run your database migrations with: php artisan migrate:fresh --seed'
            ]);
        }
        
        return response()->json([
            'status' => 'success',
            'triggers' => $triggers
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Database connection failed',
            'error' => $e->getMessage(),
            'next_steps' => 'Please check your .env file and ensure the database is running'
        ]);
    }
});
