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
        'postNom',
        'prenom',
        'dateNaissance',
        'email',
        'telephone',
        'adresse',
        'photo',
        'dateConversion',
        'dateBapteme',
        'baptiseSaintEsprit',
        'etatCivil',
        'dateAdhesion',
        'salleActuelleId',
        'salleActuelleNom',
        'roleActuel',
        'dateAffectationActuelle',
    ];

    protected $casts = [
        'dateNaissance' => 'date',
        'dateConversion' => 'date',
        'dateBapteme' => 'date',
        'dateAdhesion' => 'date',
        'dateAffectationActuelle' => 'date',
        'baptiseSaintEsprit' => 'boolean',
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
        return $this->belongsToMany(Salle::class, 'moniteur_salle', 'moniteur_id', 'salle_id')
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

    /**
     * Obtenir le User associé au moniteur
     */
    public function user()
    {
        return $this->morphOne(User::class, 'userable', 'user_type', 'user_id');
    }
}
