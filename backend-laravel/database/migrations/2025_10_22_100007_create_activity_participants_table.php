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
        Schema::create('activity_participants', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('activity_id');
            $table->uuid('participant_id');
            $table->string('participant_nom');
            $table->string('participant_prenom');
            $table->string('participant_nom_complet');
            $table->enum('participant_type', ['enfant', 'moniteur']);
            
            // Présence
            $table->boolean('est_present')->default(false);
            $table->time('heure_arrivee')->nullable();
            $table->enum('statut_presence', ['present', 'retard', 'absent'])->nullable();
            
            // Paiement (si activité payante)
            $table->boolean('a_paye')->default(false);
            $table->decimal('montant_paye', 10, 2)->nullable();
            $table->enum('statut_paiement', ['paid', 'partial', 'pending'])->nullable();
            
            // Méthode d'ajout
            $table->enum('ajoute_via', ['inscription', 'presence', 'paiement', 'manuel']);
            
            $table->timestamp('date_ajout');
            $table->timestamps();
            
            $table->foreign('activity_id')->references('id')->on('activities')->onDelete('cascade');
            $table->index(['activity_id', 'participant_type']);
            $table->index('statut_presence');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_participants');
    }
};
