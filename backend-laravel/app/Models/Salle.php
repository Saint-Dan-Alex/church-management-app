<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Salle extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'nom',
        'description',
        'capacite',
        'responsableId',
        'responsableNom',
        'adjointId',
        'adjointNom',
        'actif',
    ];

    protected $casts = [
        'capacite' => 'integer',
        'actif' => 'boolean',
    ];

    // Relations
    public function responsable()
    {
        return $this->belongsTo(Monitor::class, 'responsable_id');
    }

    public function adjoint()
    {
        return $this->belongsTo(Monitor::class, 'adjoint_id');
    }

    public function moniteurs()
    {
        return $this->belongsToMany(Monitor::class, 'moniteur_salle', 'salle_id', 'moniteur_id')
            ->withPivot('role', 'date_affectation')
            ->withTimestamps();
    }

    public function historique()
    {
        return $this->hasMany(MoniteurSalleHistorique::class, 'salle_id');
    }
}
