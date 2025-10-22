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
        Schema::create('moniteur_salle', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('moniteur_id');
            $table->string('moniteur_nom');
            $table->string('moniteur_prenom');
            $table->string('moniteur_nom_complet');
            $table->uuid('salle_id');
            $table->enum('role', ['responsable', 'adjoint', 'membre']);
            $table->date('date_affectation');
            $table->timestamps();
            
            $table->foreign('moniteur_id')->references('id')->on('monitors')->onDelete('cascade');
            $table->foreign('salle_id')->references('id')->on('salles')->onDelete('cascade');
            $table->unique(['moniteur_id', 'salle_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('moniteur_salle');
    }
};
