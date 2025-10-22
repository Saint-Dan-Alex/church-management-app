<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sortie extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'libelle',
        'description',
        'categorie',
        'montant',
        'devise',
        'date_sortie',
        'beneficiaire',
        'reference',
        'remarque',
        'enregistre_par',
        'enregistre_par_nom',
    ];

    protected $casts = [
        'montant' => 'decimal:2',
        'date_sortie' => 'date',
    ];

    // Relations
    public function enregistrePar()
    {
        return $this->belongsTo(User::class, 'enregistre_par');
    }

    // Scopes
    public function scopeByCategory($query, $categorie)
    {
        return $query->where('categorie', $categorie);
    }

    public function scopeByPeriod($query, $dateDebut, $dateFin)
    {
        return $query->whereBetween('date_sortie', [$dateDebut, $dateFin]);
    }
}
