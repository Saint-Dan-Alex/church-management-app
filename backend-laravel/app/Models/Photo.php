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
        'photo_album_id',
        'date',
        'auteur',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function album()
    {
        return $this->belongsTo(PhotoAlbum::class, 'photo_album_id');
    }

    // Scopes
    public function scopeByAlbum($query, $album)
    {
        return $query->whereHas('album', function($q) use ($album) {
             $q->where('name', $album)->orWhere('id', $album);
        });
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('date', 'desc');
    }
}
