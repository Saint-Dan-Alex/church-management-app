<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Presence extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'activity_id',
        'activity_nom',
        'moniteur_id',
        'moniteur_nom',
        'moniteur_prenom',
        'moniteur_nom_complet',
        'date_presence',
        'heure_arrivee',
        'heure_depart',
        'statut',
        'mode_enregistrement',
        'remarque',
    ];

    protected $casts = [
        'date_presence' => 'date',
    ];

    // Relations
    public function activity()
    {
        return $this->belongsTo(Activity::class, 'activity_id');
    }

    public function moniteur()
    {
        return $this->belongsTo(Monitor::class, 'moniteur_id');
    }

    // Scopes
    public function scopePresent($query)
    {
        return $query->where('statut', 'present');
    }

    public function scopeAbsent($query)
    {
        return $query->where('statut', 'absent');
    }

    public function scopeRetard($query)
    {
        return $query->where('statut', 'retard');
    }
}
