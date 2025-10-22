<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityParticipant extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'activity_id',
        'participant_id',
        'participant_nom',
        'participant_prenom',
        'participant_nom_complet',
        'participant_type',
        'est_present',
        'heure_arrivee',
        'statut_presence',
        'a_paye',
        'montant_paye',
        'statut_paiement',
        'ajoute_via',
        'date_ajout',
    ];

    protected $casts = [
        'est_present' => 'boolean',
        'a_paye' => 'boolean',
        'montant_paye' => 'decimal:2',
        'date_ajout' => 'datetime',
    ];

    // Relations
    public function activity()
    {
        return $this->belongsTo(Activity::class, 'activity_id');
    }
}
