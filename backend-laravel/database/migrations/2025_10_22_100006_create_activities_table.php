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
        Schema::create('activities', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->text('description');
            $table->date('date');
            $table->time('time');
            $table->string('duration');
            $table->string('location');
            $table->string('category');
            $table->enum('type', ['gratuite', 'payante']);
            $table->integer('participants')->default(0);
            $table->integer('maxParticipants')->nullable();
            $table->enum('status', ['upcoming', 'ongoing', 'completed'])->default('upcoming');
            $table->string('organizer');

            $table->timestamps();
            $table->softDeletes();

            $table->index('date');
            $table->index('status');
            $table->index('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
