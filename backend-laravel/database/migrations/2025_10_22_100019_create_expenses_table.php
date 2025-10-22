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
        Schema::create('expenses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('activity_id');
            $table->string('activity_nom');
            $table->enum('categorie', [
                'transport', 
                'repas', 
                'materiel', 
                'location', 
                'decoration', 
                'sonorisation', 
                'honoraires', 
                'cadeaux', 
                'autre'
            ]);
            $table->text('description');
            $table->decimal('montant', 10, 2);
            $table->enum('devise', ['CDF', 'USD']);
            $table->date('date');
            $table->string('beneficiaire')->nullable();
            $table->string('reference_facture')->nullable();
            $table->text('remarque')->nullable();
            $table->uuid('ajoute_par');
            $table->string('ajoute_par_nom');
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('activity_id')->references('id')->on('activities')->onDelete('cascade');
            $table->index('date');
            $table->index('categorie');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
