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
        Schema::create('receipts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('numero_recu')->unique();
            $table->uuid('payment_id');
            $table->uuid('activity_id');
            $table->string('activity_nom');
            $table->string('participant_nom');
            $table->decimal('montant_paye', 10, 2);
            $table->enum('devise', ['CDF', 'USD']);
            $table->text('montant_en_lettres');
            $table->enum('methode_paiement', ['cash', 'mobile_money', 'bank_transfer', 'card', 'other']);
            $table->date('date_paiement');
            $table->string('emetteur');
            $table->text('remarques')->nullable();
            $table->timestamps();
            
            $table->foreign('payment_id')->references('id')->on('payments')->onDelete('cascade');
            $table->foreign('activity_id')->references('id')->on('activities')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('receipts');
    }
};
