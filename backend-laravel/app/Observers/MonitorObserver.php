<?php

namespace App\Observers;

use App\Models\Monitor;
use App\Models\User;
use App\Services\SmsService;
use Illuminate\Support\Facades\Hash;

class MonitorObserver
{
    protected SmsService $smsService;

    public function __construct(SmsService $smsService)
    {
        $this->smsService = $smsService;
    }

    /**
     * Handle the Monitor "created" event.
     */
    public function created(Monitor $monitor): void
    {
        // Créer automatiquement un User pour le moniteur
        if ($monitor->email || $monitor->telephone) {
            // Vérifier si un user avec cet email existe déjà
            $existingUser = null;
            if ($monitor->email) {
                $existingUser = User::where('email', $monitor->email)->first();
            }
            
            if (!$existingUser) {
                // Mot de passe par défaut
                $defaultPassword = '11111111';
                
                User::create([
                    'name' => $monitor->nom_complet,
                    'email' => $monitor->email,
                    'telephone' => $monitor->telephone,
                    'password' => Hash::make($defaultPassword),
                    'user_type' => 'monitor',
                    'user_id' => $monitor->id,
                    'temporary_password' => $defaultPassword,
                ]);

                // Envoyer le mot de passe par SMS si téléphone disponible
                if ($monitor->telephone) {
                    $this->smsService->sendDefaultPassword(
                        $monitor->telephone,
                        $monitor->nom_complet ?? $monitor->prenom,
                        $defaultPassword
                    );
                }
            }
        }
    }

    /**
     * Handle the Monitor "updated" event.
     */
    public function updated(Monitor $monitor): void
    {
        // Si l'email du moniteur change, mettre à jour le User
        if ($monitor->isDirty('email')) {
            $user = User::where('user_type', 'monitor')
                        ->where('user_id', $monitor->id)
                        ->first();
            
            if ($user) {
                $user->update([
                    'email' => $monitor->email,
                    'name' => $monitor->nom_complet,
                ]);
            }
        }
    }

    /**
     * Handle the Monitor "deleted" event.
     */
    public function deleted(Monitor $monitor): void
    {
        // Optionnel : Supprimer ou désactiver le User associé
        User::where('user_type', 'monitor')
            ->where('user_id', $monitor->id)
            ->delete();
    }

    /**
     * Handle the Monitor "restored" event.
     */
    public function restored(Monitor $monitor): void
    {
        // Optionnel : Restaurer le User si le moniteur est restauré
    }
}
