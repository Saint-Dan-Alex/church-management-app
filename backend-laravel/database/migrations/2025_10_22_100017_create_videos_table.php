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
            $table->string('miniature')->nullable();
            $table->string('url'); // URL YouTube ou lien vidéo
            $table->string('type')->nullable(); // youtube, vimeo, upload
            $table->string('categorie')->nullable();
            $table->string('duree')->nullable(); // Durée en format 1h 30min
            $table->date('date')->nullable();
            $table->string('auteur')->nullable();
            $table->integer('vues')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index('categorie');
            $table->index('date');
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
