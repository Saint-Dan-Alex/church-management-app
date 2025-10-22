<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Expense extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'activity_id',
        'activity_nom',
        'categorie',
        'description',
        'montant',
        'devise',
        'date',
        'beneficiaire',
        'reference_facture',
        'remarque',
        'ajoute_par',
        'ajoute_par_nom',
    ];

    protected $casts = [
        'montant' => 'decimal:2',
        'date' => 'date',
    ];

    // Relations
    public function activity()
    {
        return $this->belongsTo(Activity::class, 'activity_id');
    }

    public function ajoutePar()
    {
        return $this->belongsTo(User::class, 'ajoute_par');
    }

    // Scopes
    public function scopeByCategory($query, $categorie)
    {
        return $query->where('categorie', $categorie);
    }

    public function scopeByActivity($query, $activityId)
    {
        return $query->where('activity_id', $activityId);
    }
}
