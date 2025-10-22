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
        Schema::create('teachings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // Informations générales
            $table->date('date_seance');
            $table->string('theme');
            $table->string('sous_theme')->nullable();
            $table->string('sujet');
            $table->text('textes_bibliques');
            $table->text('but_pedagogique');
            $table->text('verset_retenir');
            
            // Matériel et révision
            $table->text('materiel_didactique')->nullable();
            $table->text('sujet_revision')->nullable();
            
            // Introduction
            $table->text('sensibilisation')->nullable();
            $table->text('questions_reponses')->nullable();
            $table->text('question_decouverte')->nullable();
            $table->text('reponse_decouverte')->nullable();
            
            // Type de contenu
            $table->enum('type_contenu', ['points_developper', 'developpement']);
            
            // Conclusion
            $table->text('conclusion')->nullable();
            
            // Métadonnées
            $table->uuid('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('date_seance');
            $table->index('theme');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teachings');
    }
};
