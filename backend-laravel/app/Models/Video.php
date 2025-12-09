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
        'video_category_id',
        'duree',
        'date',
        'auteur',
        'vues',
    ];

    protected $casts = [
        'vues' => 'integer',
        'date' => 'date',
    ];

    public function category()
    {
        return $this->belongsTo(VideoCategory::class, 'video_category_id');
    }

    // Scopes
    public function scopeByCategory($query, $categorie)
    {
        return $query->whereHas('category', function ($q) use ($categorie) {
            $q->where('name', $categorie)->orWhere('id', $categorie);
        });
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('date', 'desc');
    }
}
