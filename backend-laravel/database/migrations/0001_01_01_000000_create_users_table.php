<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            
            // Ajout des colonnes pour le type d'utilisateur (fusionné depuis la migration 2025_10_22)
            $table->string('user_type', 50)->nullable(); // 'monitor', 'child', 'admin'
            $table->uuid('user_id')->nullable(); // ID du Monitor ou Child
            $table->string('temporary_password')->nullable(); // Mot de passe temporaire
            
            $table->rememberToken();
            $table->timestamps();
            
            // Index
            $table->index(['user_type', 'user_id']);
        });

        // Création directe de l'administrateur
        DB::table('users')->insert([
            'name' => 'Admin',
            'email' => 'admin@church.local',
            'password' => Hash::make('password'),
            'user_type' => 'admin',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
