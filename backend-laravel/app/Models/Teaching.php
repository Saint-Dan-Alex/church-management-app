<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Teaching extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'date_seance',
        'theme',
        'sous_theme',
        'sujet',
        'textes_bibliques',
        'but_pedagogique',
        'verset_retenir',
        'materiel_didactique',
        'sujet_revision',
        'sensibilisation',
        'questions_reponses',
        'question_decouverte',
        'reponse_decouverte',
        'type_contenu',
        'conclusion',
        'created_by',
    ];

    protected $casts = [
        'date_seance' => 'date',
    ];

    // Relations
    public function chants()
    {
        return $this->hasMany(TeachingChant::class, 'teaching_id')->orderBy('ordre');
    }

    public function points()
    {
        return $this->hasMany(TeachingPoint::class, 'teaching_id')->orderBy('ordre');
    }

    public function evenements()
    {
        return $this->hasMany(TeachingEvenement::class, 'teaching_id')->orderBy('ordre');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
