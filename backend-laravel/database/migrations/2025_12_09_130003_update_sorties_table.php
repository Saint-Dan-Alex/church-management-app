<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sorties', function (Blueprint $table) {
            // Check if column exists before dropping to avoid errors if re-running
            if (Schema::hasColumn('sorties', 'categorie')) {
                // Drop index if exists (convention: table_column_index)
                try {
                    $table->dropIndex(['categorie']);
                } catch (\Exception $e) {
                    // Index might not exist or have different name
                }
                $table->dropColumn('categorie');
            }
            
            if (!Schema::hasColumn('sorties', 'sortie_category_id')) {
                $table->foreignUuid('sortie_category_id')->nullable()->constrained('sortie_categories')->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('sorties', function (Blueprint $table) {
            if (Schema::hasColumn('sorties', 'sortie_category_id')) {
                $table->dropForeign(['sortie_category_id']);
                $table->dropColumn('sortie_category_id');
            }
            if (!Schema::hasColumn('sorties', 'categorie')) {
                $table->enum('categorie', [
                    'salaires', 'fournitures', 'equipements', 'loyer',
                    'electricite', 'eau', 'internet', 'transport',
                    'reparations', 'dons', 'autre'
                ])->nullable();
            }
        });
    }
};
