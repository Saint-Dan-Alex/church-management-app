<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Blog extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'title',
        'excerpt',
        'content',
        'category',
        'author',
        'status',
        'views',
        'image',
        'tags',
        'published_at',
    ];

    protected $casts = [
        'views' => 'integer',
        'tags' => 'array',
        'published_at' => 'datetime',
    ];

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    // Mutators
    public function setPublishedAtAttribute($value)
    {
        if ($this->status === 'published' && !$this->published_at) {
            $this->attributes['published_at'] = now();
        } else {
            $this->attributes['published_at'] = $value;
        }
    }
}
