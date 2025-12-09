<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AdminSeeder extends Seeder
{
    /**
     * Seed hardcoded admin accounts.
     * These accounts cannot be created through registration.
     */
    public function run(): void
    {
        $admins = [
            [
                'name' => 'leo',
                'email' => 'leo@admin.pestilink',
                'password' => 'password',
                'role' => 'admin',
            ],
            [
                'name' => 'fola',
                'email' => 'fola@admin.pestilink',
                'password' => 'password',
                'role' => 'admin',
            ],
            [
                'name' => 'lloyd',
                'email' => 'lloyd@admin.pestilink',
                'password' => 'password',
                'role' => 'admin',
            ],
            [
                'name' => 'mj',
                'email' => 'mj@admin.pestilink',
                'password' => 'password',
                'role' => 'admin',
            ],
        ];

        foreach ($admins as $admin) {
            // Use updateOrCreate to avoid duplicates
            User::updateOrCreate(
                ['email' => $admin['email']],
                [
                    'name' => $admin['name'],
                    'password' => $admin['password'], // Will be hashed by User model
                    'role' => $admin['role'],
                ]
            );
        }

        $this->command->info('Hardcoded admin accounts seeded successfully.');
    }
}
