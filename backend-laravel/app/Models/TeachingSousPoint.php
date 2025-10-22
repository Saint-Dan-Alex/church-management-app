<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeachingSousPoint extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'point_id',
        'contenu',
        'ordre',
    ];

    protected $casts = [
        'ordre' => 'integer',
    ];

    public function point()
    {
        return $this->belongsTo(TeachingPoint::class, 'point_id');
    }
}
