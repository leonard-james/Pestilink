<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

Route::get('/test/triggers', function () {
    try {
        // Check database connection
        DB::connection()->getPdo();
        
        // Get all triggers
        $triggers = DB::select("SHOW TRIGGERS");
        
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
