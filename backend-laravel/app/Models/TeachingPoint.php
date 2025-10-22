<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeachingPoint extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'teaching_id',
        'titre',
        'ordre',
    ];

    protected $casts = [
        'ordre' => 'integer',
    ];

    public function teaching()
    {
        return $this->belongsTo(Teaching::class, 'teaching_id');
    }

    public function sousPoints()
    {
        return $this->hasMany(TeachingSousPoint::class, 'point_id')->orderBy('ordre');
    }
}
