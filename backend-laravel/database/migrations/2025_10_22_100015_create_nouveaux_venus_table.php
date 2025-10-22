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
        Schema::create('nouveaux_venus', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('worship_report_id');
            $table->string('prenom');
            $table->string('nom');
            $table->text('adresse');
            $table->string('contact');
            $table->timestamps();
            
            $table->foreign('worship_report_id')->references('id')->on('worship_reports')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nouveaux_venus');
    }
};
