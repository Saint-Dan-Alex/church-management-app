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
        // Utilisation de CHANGE column column definion pour une compatibilité max
        \Illuminate\Support\Facades\DB::statement("ALTER TABLE `activity_participants` CHANGE `participant_type` `participant_type` VARCHAR(50) NOT NULL DEFAULT 'visiteur'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Difficile de rollback un varchar vers un enum si des données ne matchent pas
        // On laisse en varchar pour la sécurité
    }
};
