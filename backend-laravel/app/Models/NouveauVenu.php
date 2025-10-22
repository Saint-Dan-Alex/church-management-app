<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NouveauVenu extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'nouveaux_venus';

    protected $fillable = [
        'worship_report_id',
        'prenom',
        'nom',
        'adresse',
        'contact',
    ];

    // Relations
    public function worshipReport()
    {
        return $this->belongsTo(WorshipReport::class, 'worship_report_id');
    }
}
