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
            $table->string('thumbnail')->nullable();
            $table->string('album')->nullable(); // Nom de l'album
            $table->date('date_prise')->nullable();
            $table->string('photographe')->nullable();
            $table->json('tags')->nullable();
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            $table->string('format')->nullable(); // jpg, png, etc.
            $table->integer('size')->nullable(); // Taille en bytes
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('album');
            $table->index('date_prise');
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
