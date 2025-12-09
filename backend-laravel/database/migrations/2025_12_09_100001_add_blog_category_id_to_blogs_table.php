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
        Schema::table('blogs', function (Blueprint $table) {
            if (Schema::hasColumn('blogs', 'category')) {
                $table->dropColumn('category'); // On supprime l'ancienne colonne string
            }
            if (!Schema::hasColumn('blogs', 'date')) { // Le modèle avait 'date', mais pas la migration. Vérifions.
                 // Rien à faire, la migration d'origine n'avait pas 'date'.
            }
            
            // Ajout de la clé étrangère
            $table->foreignUuid('blog_category_id')
                  ->nullable()
                  ->after('content')
                  ->constrained('blog_categories')
                  ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('blogs', function (Blueprint $table) {
            $table->dropForeign(['blog_category_id']);
            $table->dropColumn('blog_category_id');
            $table->string('category')->nullable();
        });
    }
};
