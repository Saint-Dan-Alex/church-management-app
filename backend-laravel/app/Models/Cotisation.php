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
        'cotisation_type_id',
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
    public function type()
    {
        return $this->belongsTo(CotisationType::class, 'cotisation_type_id');
    }

    public function enregistrePar()
    {
        return $this->belongsTo(User::class, 'enregistre_par');
    }

    // Scopes
    public function scopeByType($query, $type)
    {
        return $query->whereHas('type', function($q) use ($type) {
             $q->where('name', $type)->orWhere('id', $type);
        });
    }

    public function scopeByMonth($query, $mois, $annee)
    {
        return $query->where('mois', $mois)->where('annee', $annee);
    }
}
