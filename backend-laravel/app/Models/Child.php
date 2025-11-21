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
        'firstName',
        'lastName',
        'age',
        'birthDate',
        'parentName',
        'parentPhone',
        'parentEmail',
        'group',
        'allergies',
        'medicalNotes',
        'photo',
        'status',
    ];

    protected $casts = [
        'birthDate' => 'date',
        'age' => 'integer',
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
