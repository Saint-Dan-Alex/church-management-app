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
        Schema::create('teaching_enseignements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('evenement_id');
            $table->text('contenu');
            $table->integer('ordre')->default(0);
            $table->timestamps();
            
            $table->foreign('evenement_id')->references('id')->on('teaching_evenements')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teaching_enseignements');
    }
};
