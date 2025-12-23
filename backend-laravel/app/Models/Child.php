<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Child extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'nom',
        'post_nom',
        'prenom',
        'nom_complet',
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
        'salle_id',
        'salle_nom',
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

    public function presences()
    {
        return $this->morphMany(Presence::class, 'participant');
    }

    /**
     * Obtenir le User associé à l'enfant
     */
    public function user()
    {
        return $this->morphOne(User::class, 'userable', 'user_type', 'user_id');
    }

    /**
     * Salle d'affectation en fonction de l'âge
     */
    public function salle(): BelongsTo
    {
        return $this->belongsTo(Salle::class, 'salle_id');
    }

    /**
     * Calculer la salle cible selon l'âge courant
     * Retourne ['salle_id' => ?|null, 'salle_nom' => string]
     */
    public function computeSalleForAge(): array
    {
        $age = null;
        if ($this->date_naissance) {
            try {
                $dob = new \DateTime($this->date_naissance);
                $age = (int) $dob->diff(new \DateTime())->y;
            } catch (\Exception $e) {
                $age = null;
            }
        }

        $targetNom = null;
        if ($age === null) {
            $targetNom = $this->salle_nom; // pas de changement si âge inconnu
        } elseif ($age > 18) {
            $targetNom = 'ADO PARTI';
        } elseif ($age >= 14) {
            $targetNom = 'Adolescents';
        } elseif ($age >= 10) {
            $targetNom = 'Cadets';
        } elseif ($age >= 8) {
            $targetNom = 'Juniors';
        } elseif ($age >= 6) {
            $targetNom = 'Ainés';
        } elseif ($age >= 3) {
            $targetNom = 'Jardin';
        } else {
            $targetNom = null; // trop jeune, non affecté
        }

        $targetId = null;
        if ($targetNom && $targetNom !== 'ADO PARTI') {
            $salle = Salle::where('nom', $targetNom)->first();
            $targetId = $salle?->id;
        }

        return ['salle_id' => $targetId, 'salle_nom' => $targetNom];
    }
}
