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
        Schema::table('photos', function (Blueprint $table) {
            $table->dropIndex(['album']);
            $table->dropColumn('album');
            $table->foreignUuid('photo_album_id')->nullable()->constrained('photo_albums')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('photos', function (Blueprint $table) {
            $table->dropForeign(['photo_album_id']);
            $table->dropColumn('photo_album_id');
            $table->string('album')->nullable();
            $table->index('album');
        });
    }
};
