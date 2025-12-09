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
        Schema::table('videos', function (Blueprint $table) {
            $table->dropIndex(['categorie']);
            $table->dropColumn('categorie');
            $table->foreignUuid('video_category_id')->nullable()->constrained('video_categories')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('videos', function (Blueprint $table) {
            $table->dropForeign(['video_category_id']);
            $table->dropColumn('video_category_id');
            $table->string('categorie')->nullable();
            $table->index('categorie');
        });
    }
};
