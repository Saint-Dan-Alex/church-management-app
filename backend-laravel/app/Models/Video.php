<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Video extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'titre',
        'description',
        'miniature',
        'url',
        'type',
        'categorie',
        'duree',
        'date',
        'auteur',
        'vues',
    ];

    protected $casts = [
        'vues' => 'integer',
        'date' => 'date',
    ];

    // Scopes
    public function scopeByCategory($query, $categorie)
    {
        return $query->where('categorie', $categorie);
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('date', 'desc');
    }
}
