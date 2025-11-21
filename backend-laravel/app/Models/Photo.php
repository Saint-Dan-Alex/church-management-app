<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Photo extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'titre',
        'description',
        'url',
        'album',
        'date',
        'auteur',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    // Scopes
    public function scopeByAlbum($query, $album)
    {
        return $query->where('album', $album);
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('date', 'desc');
    }
}
