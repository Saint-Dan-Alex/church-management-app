<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cotisation extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'moniteur',
        'montant',
        'devise',
        'periode',
        'datePaiement',
        'statut',
        'modePaiement',
        'remarque',
    ];

    protected $casts = [
        'montant' => 'decimal:2',
        'datePaiement' => 'date',
    ];

    // Relations
    public function enregistrePar()
    {
        return $this->belongsTo(User::class, 'enregistre_par');
    }

    // Scopes
    public function scopeByType($query, $type)
    {
        return $query->where('type_cotisation', $type);
    }

    public function scopeByMonth($query, $mois, $annee)
    {
        return $query->where('mois', $mois)->where('annee', $annee);
    }
}
