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

    /**
     * Surcharge de toArray pour inclure les versions camelCase
     * nécessaires au frontend.
     */
    public function toArray()
    {
        $attributes = parent::toArray();
        
        $camelCaseAttributes = [
            'postNom' => $this->post_nom,
            'dateNaissance' => $this->date_naissance,
            'dateConversion' => $this->date_conversion,
            'dateBapteme' => $this->date_bapteme,
            'baptiseSaintEsprit' => $this->baptise_saint_esprit,
            'etatCivil' => $this->etat_civil,
            'dateAdhesion' => $this->date_adhesion,
            'salleActuelleId' => $this->salle_actuelle_id,
            'salleActuelleNom' => $this->salle_actuelle_nom ?? $this->salleActuelle?->nom,
            'roleActuel' => $this->role_actuel,
            'dateAffectationActuelle' => $this->date_affectation_actuelle,
            'nomComplet' => $this->nom_complet,
        ];

        return array_merge($attributes, $camelCaseAttributes);
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
        return $this->morphMany(Presence::class, 'participant');
    }

    /**
     * Obtenir le User associé au moniteur
     */
    public function user()
    {
        return $this->morphOne(User::class, 'userable', 'user_type', 'user_id');
    }
}
