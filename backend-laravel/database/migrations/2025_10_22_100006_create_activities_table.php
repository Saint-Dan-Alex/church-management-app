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
        Schema::create('activities', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('titre');
            $table->text('description');
            $table->enum('type', ['gratuite', 'payante']);
            $table->date('date');
            $table->time('heure_debut');
            $table->time('heure_fin');
            $table->string('lieu');
            $table->string('responsable');
            $table->uuid('responsable_id');
            
            // Configuration du paiement (si payante)
            $table->decimal('montant_requis', 10, 2)->nullable();
            $table->enum('devise', ['CDF', 'USD'])->nullable();
            $table->decimal('montant_alternatif', 10, 2)->nullable();
            $table->enum('devise_alternative', ['CDF', 'USD'])->nullable();
            
            // Statut
            $table->enum('statut', ['planifiee', 'en_cours', 'terminee', 'annulee'])->default('planifiee');
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('date');
            $table->index('statut');
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
