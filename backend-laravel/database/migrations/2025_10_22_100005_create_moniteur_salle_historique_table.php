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
        Schema::create('moniteur_salle_historique', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('moniteur_id');
            $table->string('moniteur_nom');
            $table->string('moniteur_prenom');
            $table->string('moniteur_nom_complet');
            $table->uuid('salle_id');
            $table->string('salle_nom');
            $table->enum('role', ['responsable', 'adjoint', 'membre']);
            $table->date('date_debut');
            $table->date('date_fin')->nullable();
            $table->boolean('actif')->default(true);
            $table->text('motif_changement')->nullable();
            $table->timestamps();
            
            $table->foreign('moniteur_id')->references('id')->on('monitors')->onDelete('cascade');
            $table->foreign('salle_id')->references('id')->on('salles')->onDelete('cascade');
            $table->index(['moniteur_id', 'actif']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('moniteur_salle_historique');
    }
};
