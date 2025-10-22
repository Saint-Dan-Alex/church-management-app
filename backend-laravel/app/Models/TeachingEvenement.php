<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeachingEvenement extends Model
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

    public function enseignements()
    {
        return $this->hasMany(TeachingEnseignement::class, 'evenement_id')->orderBy('ordre');
    }
}
