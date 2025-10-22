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
        'membre_nom',
        'type_cotisation',
        'montant',
        'devise',
        'date_cotisation',
        'mois',
        'annee',
        'mode_paiement',
        'numero_recu',
        'remarque',
        'enregistre_par',
        'enregistre_par_nom',
    ];

    protected $casts = [
        'montant' => 'decimal:2',
        'date_cotisation' => 'date',
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
