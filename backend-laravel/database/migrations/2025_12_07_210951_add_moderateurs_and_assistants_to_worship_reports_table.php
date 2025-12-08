<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('worship_reports', function (Blueprint $table) {
            // Ajouter les nouvelles colonnes
            $table->text('moderateurs')->nullable()->after('salle');
            $table->text('assistants')->nullable()->after('moderateurs');
        });

        // Copier les données de moniteurs vers moderateurs
        DB::statement('UPDATE worship_reports SET moderateurs = moniteurs WHERE moniteurs IS NOT NULL');

        // Supprimer l'ancienne colonne moniteurs
        Schema::table('worship_reports', function (Blueprint $table) {
            $table->dropColumn('moniteurs');
        });
    }

    public function down(): void
    {
        Schema::table('worship_reports', function (Blueprint $table) {
            // Recréer moniteurs
            $table->text('moniteurs')->nullable()->after('salle');
        });

        // Copier moderateurs vers moniteurs
        DB::statement('UPDATE worship_reports SET moniteurs = moderateurs WHERE moderateurs IS NOT NULL');

        // Supprimer moderateurs et assistants
        Schema::table('worship_reports', function (Blueprint $table) {
            $table->dropColumn(['moderateurs', 'assistants']);
        });
    }
};
