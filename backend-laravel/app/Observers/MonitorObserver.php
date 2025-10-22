<?php

namespace App\Observers;

use App\Models\Monitor;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class MonitorObserver
{
    /**
     * Handle the Monitor "created" event.
     */
    public function created(Monitor $monitor): void
    {
        // Créer automatiquement un User pour le moniteur
        if ($monitor->email) {
            // Vérifier si un user avec cet email existe déjà
            $existingUser = User::where('email', $monitor->email)->first();
            
            if (!$existingUser) {
                // Générer un mot de passe temporaire
                $temporaryPassword = Str::random(12);
                
                User::create([
                    'name' => $monitor->nom_complet,
                    'email' => $monitor->email,
                    'password' => Hash::make($temporaryPassword),
                    'user_type' => 'monitor',
                    'user_id' => $monitor->id,
                    'temporary_password' => $temporaryPassword, // Pour l'envoyer par email
                ]);

                // TODO: Envoyer un email avec le mot de passe temporaire
                // Mail::to($monitor->email)->send(new WelcomeMonitorMail($monitor, $temporaryPassword));
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
