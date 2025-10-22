<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Activity extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'titre',
        'description',
        'type',
        'date',
        'heure_debut',
        'heure_fin',
        'lieu',
        'responsable',
        'responsable_id',
        'montant_requis',
        'devise',
        'montant_alternatif',
        'devise_alternative',
        'statut',
    ];

    protected $casts = [
        'date' => 'date',
        'montant_requis' => 'decimal:2',
        'montant_alternatif' => 'decimal:2',
    ];

    // Relations
    public function participants()
    {
        return $this->hasMany(ActivityParticipant::class, 'activity_id');
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class, 'activity_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'activity_id');
    }

    public function presences()
    {
        return $this->hasMany(Presence::class, 'activity_id');
    }
}
