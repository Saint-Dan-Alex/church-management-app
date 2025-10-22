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
        Schema::create('monitors', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nom');
            $table->string('post_nom');
            $table->string('prenom');
            $table->date('date_naissance');
            $table->string('email')->unique();
            $table->string('telephone');
            $table->text('adresse');
            $table->string('photo')->nullable();
            $table->date('date_conversion')->nullable();
            $table->date('date_bapteme')->nullable();
            $table->boolean('baptise_saint_esprit')->default(false);
            $table->enum('etat_civil', ['Célibataire', 'Marié(e)', 'Veuf(ve)', 'Divorcé(e)']);
            $table->date('date_adhesion');
            $table->uuid('salle_actuelle_id')->nullable();
            $table->string('salle_actuelle_nom')->nullable();
            $table->enum('role_actuel', ['responsable', 'adjoint', 'membre'])->nullable();
            $table->date('date_affectation_actuelle')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('email');
            $table->index('telephone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('monitors');
    }
};
