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
        Schema::create('farmers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('farm_name');
            $table->text('description')->nullable();
            $table->string('location');
            $table->string('phone');
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->text('address');
            $table->boolean('is_verified')->default(false);
            $table->string('logo_url')->nullable();
            $table->string('facebook_link')->nullable();
            $table->string('email_contact')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('farmers');
    }
};
