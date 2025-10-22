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
        Schema::create('cotisations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('membre_nom');
            $table->enum('type_cotisation', ['mensuelle', 'annuelle', 'speciale', 'autre']);
            $table->decimal('montant', 10, 2);
            $table->enum('devise', ['CDF', 'USD']);
            $table->date('date_cotisation');
            $table->string('mois')->nullable(); // Pour cotisations mensuelles
            $table->string('annee')->nullable();
            $table->enum('mode_paiement', ['cash', 'mobile_money', 'bank_transfer', 'card', 'other'])->default('cash');
            $table->string('numero_recu')->unique()->nullable();
            $table->text('remarque')->nullable();
            $table->uuid('enregistre_par');
            $table->string('enregistre_par_nom');
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('date_cotisation');
            $table->index('type_cotisation');
            // Index composite removed to avoid MySQL utf8mb4 length limit
            // $table->index(['mois', 'annee']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cotisations');
    }
};
