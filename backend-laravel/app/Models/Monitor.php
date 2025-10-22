<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Monitor extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'nom',
        'post_nom',
        'prenom',
        'date_naissance',
        'email',
        'telephone',
        'adresse',
        'photo',
        'date_conversion',
        'date_bapteme',
        'baptise_saint_esprit',
        'etat_civil',
        'date_adhesion',
        'salle_actuelle_id',
        'salle_actuelle_nom',
        'role_actuel',
        'date_affectation_actuelle',
    ];

    protected $casts = [
        'date_naissance' => 'date',
        'date_conversion' => 'date',
        'date_bapteme' => 'date',
        'date_adhesion' => 'date',
        'date_affectation_actuelle' => 'date',
        'baptise_saint_esprit' => 'boolean',
    ];

    protected $appends = ['nom_complet'];

    public function getNomCompletAttribute()
    {
        return "{$this->nom} {$this->post_nom} {$this->prenom}";
    }

    // Relations
    public function salleActuelle()
    {
        return $this->belongsTo(Salle::class, 'salle_actuelle_id');
    }

    public function salles()
    {
        return $this->belongsToMany(Salle::class, 'moniteur_salle')
            ->withPivot('role', 'date_affectation')
            ->withTimestamps();
    }

    public function historiqueSalles()
    {
        return $this->hasMany(MoniteurSalleHistorique::class, 'moniteur_id');
    }

    public function presences()
    {
        return $this->hasMany(Presence::class, 'moniteur_id');
    }
}
