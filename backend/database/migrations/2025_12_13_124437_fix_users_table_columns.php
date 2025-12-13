<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, check if we need to modify the role column
        if (Schema::hasColumn('users', 'role')) {
            // Check if the role column is an enum with the correct values
            $columnType = DB::select(
                "SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'role'",
                [config('database.connections.mysql.database')]
            );

            if (!empty($columnType) && !str_contains($columnType[0]->COLUMN_TYPE, "enum('admin','company','farmer')")) {
                // If the role column exists but with different values, modify it
                DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'company', 'farmer') NOT NULL DEFAULT 'farmer'");
            }
        } else {
            // Add role if it doesn't exist
            Schema::table('users', function (Blueprint $table) {
                $table->enum('role', ['admin', 'company', 'farmer'])->default('farmer')->after('email_verified_at');
            });
        }

        // Add other columns with existence checks
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'status')) {
                $table->enum('status', ['active', 'inactive', 'suspended'])->default('active')->after('role');
            }
            if (!Schema::hasColumn('users', 'last_login')) {
                $table->timestamp('last_login')->nullable()->after('status');
            }
            if (!Schema::hasColumn('users', 'first_name')) {
                $table->string('first_name')->after('name')->nullable();
            }
            if (!Schema::hasColumn('users', 'last_name')) {
                $table->string('last_name')->after('first_name')->nullable();
            }
            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone')->after('email')->nullable();
            }
            if (!Schema::hasColumn('users', 'address')) {
                $table->text('address')->after('phone')->nullable();
            }
            if (!Schema::hasColumn('users', 'is_admin')) {
                $table->boolean('is_admin')->default(false)->after('address');
            }
            if (!Schema::hasColumn('users', 'avatar')) {
                $table->string('avatar')->nullable()->after('is_admin');
            }
        });

        // If name column exists and we've added first_name and last_name,
        // we can split the name into first and last name
        if (Schema::hasColumn('users', 'name') && 
            Schema::hasColumn('users', 'first_name') && 
            Schema::hasColumn('users', 'last_name')) {
            $users = DB::table('users')->whereNull('first_name')->get();
            foreach ($users as $user) {
                $nameParts = explode(' ', $user->name, 2);
                $firstName = $nameParts[0] ?? '';
                $lastName = $nameParts[1] ?? '';
                
                DB::table('users')
                    ->where('id', $user->id)
                    ->update([
                        'first_name' => $firstName,
                        'last_name' => $lastName
                    ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // We don't drop the columns in the down method to prevent data loss
        // If you need to rollback, create a new migration to handle it
    }
};
