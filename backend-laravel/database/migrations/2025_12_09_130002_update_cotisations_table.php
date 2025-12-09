<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cotisations', function (Blueprint $table) {
            $table->dropColumn('type_cotisation');
            $table->foreignUuid('cotisation_type_id')->nullable()->constrained('cotisation_types')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('cotisations', function (Blueprint $table) {
            $table->dropForeign(['cotisation_type_id']);
            $table->dropColumn('cotisation_type_id');
            $table->enum('type_cotisation', ['mensuelle', 'annuelle', 'speciale', 'autre'])->nullable();
        });
    }
};
