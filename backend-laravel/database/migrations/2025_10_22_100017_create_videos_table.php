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
        Schema::create('videos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('titre');
            $table->text('description')->nullable();
            $table->string('url'); // URL YouTube ou lien vidéo
            $table->string('thumbnail')->nullable();
            $table->string('category')->nullable();
            $table->string('duration')->nullable(); // Durée en format HH:MM:SS
            $table->integer('views')->default(0);
            $table->date('date_enregistrement')->nullable();
            $table->string('predicateur')->nullable();
            $table->json('tags')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('category');
            $table->index('date_enregistrement');
            $table->index('is_featured');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('videos');
    }
};
