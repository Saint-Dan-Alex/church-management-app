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
        // Add 'excuse' to statut_presence
        DB::statement("ALTER TABLE activity_participants MODIFY COLUMN statut_presence ENUM('present', 'retard', 'absent', 'excuse') NULL");

        // Add 'automatique' to ajoute_via
        DB::statement("ALTER TABLE activity_participants MODIFY COLUMN ajoute_via ENUM('inscription', 'presence', 'paiement', 'manuel', 'automatique') NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to original enums (Warning: this might cause data loss if values exist)
        // For safety in dev environment, we just leave it or revert manually if needed.
        // Theoretically:
        // DB::statement("ALTER TABLE activity_participants MODIFY COLUMN statut_presence ENUM('present', 'retard', 'absent') NULL");
        // DB::statement("ALTER TABLE activity_participants MODIFY COLUMN ajoute_via ENUM('inscription', 'presence', 'paiement', 'manuel') NOT NULL");
    }
};
