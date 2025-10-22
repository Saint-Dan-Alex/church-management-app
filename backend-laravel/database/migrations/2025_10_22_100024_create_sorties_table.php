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
        Schema::create('sorties', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('libelle');
            $table->text('description')->nullable();
            $table->enum('categorie', [
                'salaires',
                'fournitures',
                'equipements',
                'loyer',
                'electricite',
                'eau',
                'internet',
                'transport',
                'reparations',
                'dons',
                'autre'
            ]);
            $table->decimal('montant', 10, 2);
            $table->enum('devise', ['CDF', 'USD']);
            $table->date('date_sortie');
            $table->string('beneficiaire')->nullable();
            $table->string('reference')->nullable();
            $table->text('remarque')->nullable();
            $table->uuid('enregistre_par');
            $table->string('enregistre_par_nom');
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('date_sortie');
            $table->index('categorie');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sorties');
    }
};
