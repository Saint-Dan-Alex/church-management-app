<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('presences', function (Blueprint $table) {
            // 1. Ajouter les colonnes polymorphiques (activités peuvent avoir des présences de différents types de participants)
            $table->uuid('participant_id')->nullable()->after('activity_nom');
            $table->string('participant_type')->nullable()->after('participant_id');
            
            // 2. Rendre la colonne moniteur_id nullable car elle sera remplacée par le polymorphisme
            $table->uuid('moniteur_id')->nullable()->change();
            
            // Index pour les performances
            $table->index(['participant_type', 'participant_id']);
        });

        // 3. Migrer les données existantes
        // On déplace les moniteur_id vers participant_id et on définit le type à 'App\Models\Monitor'
        DB::table('presences')->whereNotNull('moniteur_id')->update([
            'participant_id' => DB::raw('moniteur_id'),
            'participant_type' => 'App\Models\Monitor'
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Inverse de la migration (au cas où, mais attention à la perte de données si on a ajouté des 'Child')
        Schema::table('presences', function (Blueprint $table) {
            $table->dropIndex(['participant_type', 'participant_id']);
            $table->dropColumn(['participant_id', 'participant_type']);
            $table->uuid('moniteur_id')->nullable(false)->change();
        });
    }
};
