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
        Schema::table('service_bookings', function (Blueprint $table) {
            $table->dateTime('preferred_date')->after('status');
            $table->string('service_address')->after('preferred_date');
            $table->string('contact_phone')->after('service_address');
            $table->string('pest_type')->after('contact_phone');
            $table->text('problem_description')->nullable()->after('pest_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('service_bookings', function (Blueprint $table) {
            $table->dropColumn([
                'preferred_date',
                'service_address',
                'contact_phone',
                'pest_type',
                'problem_description'
            ]);
        });
    }
};
