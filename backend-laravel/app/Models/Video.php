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
        'url',
        'thumbnail',
        'category',
        'duration',
        'views',
        'date_enregistrement',
        'predicateur',
        'tags',
        'is_featured',
    ];

    protected $casts = [
        'views' => 'integer',
        'date_enregistrement' => 'date',
        'tags' => 'array',
        'is_featured' => 'boolean',
    ];

    // Scopes
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }
}
