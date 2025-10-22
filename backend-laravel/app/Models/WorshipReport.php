<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorshipReport extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'date',
        'salle',
        'orateurs',
        'predicateur',
        'moniteurs',
        'effectif_freres',
        'effectif_soeurs',
        'offrandes',
        'nombre_nouveaux_venus',
        'created_by',
    ];

    protected $casts = [
        'date' => 'date',
        'orateurs' => 'array',
        'moniteurs' => 'array',
        'effectif_freres' => 'integer',
        'effectif_soeurs' => 'integer',
        'nombre_nouveaux_venus' => 'integer',
    ];

    protected $appends = ['effectif_total'];

    public function getEffectifTotalAttribute()
    {
        return $this->effectif_freres + $this->effectif_soeurs;
    }

    // Relations
    public function nouveauxVenus()
    {
        return $this->hasMany(NouveauVenu::class, 'worship_report_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
