<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('activity_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('color')->default('#3B82F6'); // Couleur par défaut (bleu)
            $table->string('icon')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // Insérer les catégories par défaut
        DB::table('activity_categories')->insert([
            ['name' => 'Enfants', 'color' => '#3B82F6', 'order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Prière', 'color' => '#9333EA', 'order' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Jeunesse', 'color' => '#22C55E', 'order' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Louange', 'color' => '#F97316', 'order' => 4, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Formation', 'color' => '#EC4899', 'order' => 5, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Sortie', 'color' => '#06B6D4', 'order' => 6, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Culte', 'color' => '#0EA5E9', 'order' => 7, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Réunion', 'color' => '#64748B', 'order' => 8, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_categories');
    }
};
