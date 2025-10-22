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
        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('activity_id');
            $table->string('activity_nom');
            $table->uuid('participant_id');
            $table->string('participant_nom');
            $table->string('participant_prenom');
            $table->string('participant_nom_complet');
            $table->decimal('montant', 10, 2);
            $table->enum('devise', ['CDF', 'USD']);
            $table->decimal('montant_paye', 10, 2)->default(0);
            $table->decimal('montant_restant', 10, 2)->storedAs('montant - montant_paye');
            $table->enum('statut', ['pending', 'paid', 'partial', 'overdue', 'cancelled'])->default('pending');
            $table->enum('methode_paiement', ['cash', 'mobile_money', 'bank_transfer', 'card', 'other'])->nullable();
            $table->date('date_echeance');
            $table->date('date_paiement')->nullable();
            $table->string('numero_paiement')->unique();
            $table->string('numero_recu')->nullable();
            $table->text('remarque')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('activity_id')->references('id')->on('activities')->onDelete('cascade');
            $table->index('statut');
            $table->index('date_echeance');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
