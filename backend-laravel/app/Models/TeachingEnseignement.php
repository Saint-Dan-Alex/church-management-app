<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeachingEnseignement extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'evenement_id',
        'contenu',
        'ordre',
    ];

    protected $casts = [
        'ordre' => 'integer',
    ];

    public function evenement()
    {
        return $this->belongsTo(TeachingEvenement::class, 'evenement_id');
    }
}
