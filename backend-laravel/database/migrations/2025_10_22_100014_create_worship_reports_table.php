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
        Schema::create('worship_reports', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->date('date');
            $table->enum('salle', ['Jardin', 'Ainés', 'Juniors', 'Cadets', 'Adolescents']);
            
            // Personnel
            $table->json('orateurs'); // Liste des orateurs
            $table->string('predicateur');
            $table->json('moniteurs'); // Assistants/Moniteurs ayant servi
            
            // Effectifs
            $table->integer('effectif_freres')->default(0);
            $table->integer('effectif_soeurs')->default(0);
            $table->integer('effectif_total')->storedAs('effectif_freres + effectif_soeurs');
            
            // Finances
            $table->string('offrandes'); // Montant avec devise
            
            // Nouveaux venus
            $table->integer('nombre_nouveaux_venus')->default(0);
            
            // Métadonnées
            $table->uuid('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('date');
            $table->index('salle');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('worship_reports');
    }
};
