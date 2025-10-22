<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'activity_id',
        'activity_nom',
        'participant_id',
        'participant_nom',
        'participant_prenom',
        'participant_nom_complet',
        'montant',
        'devise',
        'montant_paye',
        'statut',
        'methode_paiement',
        'date_echeance',
        'date_paiement',
        'numero_paiement',
        'numero_recu',
        'remarque',
    ];

    protected $casts = [
        'montant' => 'decimal:2',
        'montant_paye' => 'decimal:2',
        'date_echeance' => 'date',
        'date_paiement' => 'date',
    ];

    protected $appends = ['montant_restant'];

    public function getMontantRestantAttribute()
    {
        return $this->montant - $this->montant_paye;
    }

    // Relations
    public function activity()
    {
        return $this->belongsTo(Activity::class, 'activity_id');
    }

    public function receipts()
    {
        return $this->hasMany(Receipt::class, 'payment_id');
    }

    // Scopes
    public function scopePaid($query)
    {
        return $query->where('statut', 'paid');
    }

    public function scopePending($query)
    {
        return $query->where('statut', 'pending');
    }

    public function scopeOverdue($query)
    {
        return $query->where('statut', 'overdue');
    }
}
