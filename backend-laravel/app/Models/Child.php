<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Child extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'nom',
        'post_nom',
        'prenom',
        'date_naissance',
        'genre',
        'etat_civil',
        'adresse',
        'telephone',
        'email',
        'photo',
        'nom_pere',
        'nom_mere',
        'telephone_parent1',
        'telephone_parent2',
        'email_parents',
        'contact_urgence',
        'lien_contact_urgence',
        'date_conversion',
        'date_bapteme',
        'baptise_saint_esprit',
        'vie_donnee_a_jesus',
        'est_ouvrier',
        'commission_actuelle',
        'commission_souhaitee',
        'date_adhesion',
        'allergies_connues',
        'allergies_details',
        'maladies',
        'traitement',
        'autorisation_soins',
        'vie_chretienne',
        'vie_priere',
        'comprehension_bible',
        'gagne_une_ame',
        'encadreur',
        'qualite_enseignements',
        'sujet_souhaite',
        'besoin_suggestion',
    ];

    protected $casts = [
        'date_naissance' => 'date',
        'date_conversion' => 'date',
        'date_bapteme' => 'date',
        'date_adhesion' => 'date',
        'est_ouvrier' => 'boolean',
        'allergies_connues' => 'boolean',
        'autorisation_soins' => 'boolean',
    ];

    protected $appends = ['nom_complet'];

    public function getNomCompletAttribute()
    {
        return "{$this->nom} {$this->post_nom} {$this->prenom}";
    }

    // Relations
    public function participations()
    {
        return $this->morphMany(ActivityParticipant::class, 'participant');
    }
}
