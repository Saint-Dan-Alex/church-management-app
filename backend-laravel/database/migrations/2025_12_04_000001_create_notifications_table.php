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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('type', 50); // info, success, warning, error, payment, presence, etc.
            $table->string('title');
            $table->text('message');
            $table->json('data')->nullable(); // Données supplémentaires
            $table->string('action_url')->nullable(); // URL de redirection
            $table->timestamp('read_at')->nullable(); // Date de lecture
            $table->timestamps();

            // Index pour optimiser les requêtes
            $table->index(['user_id', 'read_at']);
            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
