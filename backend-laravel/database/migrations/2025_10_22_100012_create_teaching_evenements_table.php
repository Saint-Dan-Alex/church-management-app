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
        Schema::create('teaching_evenements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('teaching_id');
            $table->string('titre');
            $table->integer('ordre')->default(0);
            $table->timestamps();
            
            $table->foreign('teaching_id')->references('id')->on('teachings')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teaching_evenements');
    }
};
