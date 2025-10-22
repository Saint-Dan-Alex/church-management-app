<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('children', function (Blueprint $table) {
            $table->uuid('salle_id')->nullable()->after('autorisation_soins');
            $table->string('salle_nom')->nullable()->after('salle_id');

            $table->index('salle_id');
            $table->index('salle_nom');
        });
    }

    public function down(): void
    {
        Schema::table('children', function (Blueprint $table) {
            $table->dropIndex(['salle_id']);
            $table->dropIndex(['salle_nom']);
            $table->dropColumn(['salle_id', 'salle_nom']);
        });
    }
};
