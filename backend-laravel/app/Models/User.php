<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'user_type', // 'monitor' ou 'child'
        'user_id', // ID du Monitor ou Child
        'temporary_password', // Mot de passe temporaire (pour envoi email)
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relation polymorphique avec Monitor ou Child
     */
    public function userable()
    {
        return $this->morphTo(__FUNCTION__, 'user_type', 'user_id');
    }

    /**
     * Vérifier si l'utilisateur est un moniteur
     */
    public function isMonitor(): bool
    {
        return $this->user_type === 'monitor';
    }

    /**
     * Vérifier si l'utilisateur est un enfant
     */
    public function isChild(): bool
    {
        return $this->user_type === 'child';
    }

    /**
     * Obtenir le moniteur associé
     */
    public function monitor()
    {
        return $this->user_type === 'monitor' 
            ? Monitor::find($this->user_id) 
            : null;
    }

    /**
     * Obtenir l'enfant associé
     */
    public function child()
    {
        return $this->user_type === 'child' 
            ? Child::find($this->user_id) 
            : null;
    }
}
