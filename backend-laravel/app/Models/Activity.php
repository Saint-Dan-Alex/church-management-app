<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Activity extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'date',
        'time',
        'duration',
        'location',
        'category',
        'type',
        'participants',
        'maxParticipants',
        'status',
        'organizer',
    ];

    protected $casts = [
        'date' => 'date',
        'participants' => 'integer',
        'maxParticipants' => 'integer',
    ];

    // Relations
    public function participants()
    {
        return $this->hasMany(ActivityParticipant::class, 'activity_id');
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class, 'activity_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'activity_id');
    }

    public function presences()
    {
        return $this->hasMany(Presence::class, 'activity_id');
    }
}
