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
        Schema::create('presences', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('activity_id');
            $table->string('activity_nom');
            $table->uuid('moniteur_id');
            $table->string('moniteur_nom');
            $table->string('moniteur_prenom');
            $table->string('moniteur_nom_complet');
            $table->date('date_presence');
            $table->time('heure_arrivee');
            $table->time('heure_depart')->nullable();
            $table->enum('statut', ['present', 'absent', 'retard', 'excuse'])->default('present');
            $table->enum('mode_enregistrement', ['qr_code', 'manuel', 'auto'])->default('manuel');
            $table->text('remarque')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('activity_id')->references('id')->on('activities')->onDelete('cascade');
            $table->foreign('moniteur_id')->references('id')->on('monitors')->onDelete('cascade');
            $table->index(['activity_id', 'moniteur_id']);
            $table->index('statut');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presences');
    }
};
