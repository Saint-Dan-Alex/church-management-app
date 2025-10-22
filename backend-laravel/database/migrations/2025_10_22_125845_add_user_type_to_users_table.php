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
        Schema::table('users', function (Blueprint $table) {
            $table->string('user_type', 50)->nullable()->after('password'); // 'monitor' ou 'child'
            $table->uuid('user_id')->nullable()->after('user_type'); // ID du Monitor ou Child
            $table->string('temporary_password')->nullable()->after('user_id'); // Mot de passe temporaire
            
            // Index pour améliorer les performances
            $table->index(['user_type', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['user_type', 'user_id']);
            $table->dropColumn(['user_type', 'user_id', 'temporary_password']);
        });
    }
};
