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
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'telephone')) {
                $table->string('telephone')->nullable()->after('email');
            }
            if (!Schema::hasColumn('users', 'two_factor_channel')) {
                $table->string('two_factor_channel')->nullable()->after('two_factor_expires_at');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'telephone')) {
                $table->dropColumn('telephone');
            }
            if (Schema::hasColumn('users', 'two_factor_channel')) {
                $table->dropColumn('two_factor_channel');
            }
        });
    }
};
