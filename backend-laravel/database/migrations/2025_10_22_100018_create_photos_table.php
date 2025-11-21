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
        Schema::create('photos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('titre');
            $table->text('description')->nullable();
            $table->string('url'); // Chemin de la photo
            $table->string('album')->nullable(); // Nom de l'album
            $table->date('date')->nullable();
            $table->string('auteur')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('album');
            $table->index('date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('photos');
    }
};
