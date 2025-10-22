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
        'thumbnail',
        'album',
        'date_prise',
        'photographe',
        'tags',
        'width',
        'height',
        'format',
        'size',
    ];

    protected $casts = [
        'date_prise' => 'date',
        'tags' => 'array',
        'width' => 'integer',
        'height' => 'integer',
        'size' => 'integer',
    ];

    // Scopes
    public function scopeByAlbum($query, $album)
    {
        return $query->where('album', $album);
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('date_prise', 'desc');
    }
}
