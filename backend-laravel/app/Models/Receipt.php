<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Receipt extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'numero_recu',
        'payment_id',
        'activity_id',
        'activity_nom',
        'participant_nom',
        'montant_paye',
        'devise',
        'montant_en_lettres',
        'methode_paiement',
        'date_paiement',
        'emetteur',
        'remarques',
    ];

    protected $casts = [
        'montant_paye' => 'decimal:2',
        'date_paiement' => 'date',
    ];

    // Relations
    public function payment()
    {
        return $this->belongsTo(Payment::class, 'payment_id');
    }

    public function activity()
    {
        return $this->belongsTo(Activity::class, 'activity_id');
    }
}
