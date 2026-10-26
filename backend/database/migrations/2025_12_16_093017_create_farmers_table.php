<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasColumn('farmers', 'is_verified')) {
            Schema::table('farmers', function (Blueprint $table) {
                $table->boolean('is_verified')->default(false);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // The farmers table is managed by the earlier farmers migrations.
    }
};
