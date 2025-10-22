<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MoniteurSalleHistorique extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'moniteur_salle_historique';

    protected $fillable = [
        'moniteur_id',
        'moniteur_nom',
        'moniteur_prenom',
        'moniteur_nom_complet',
        'salle_id',
        'salle_nom',
        'role',
        'date_debut',
        'date_fin',
        'actif',
        'motif_changement',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
        'actif' => 'boolean',
    ];

    // Relations
    public function moniteur()
    {
        return $this->belongsTo(Monitor::class, 'moniteur_id');
    }

    public function salle()
    {
        return $this->belongsTo(Salle::class, 'salle_id');
    }
}
