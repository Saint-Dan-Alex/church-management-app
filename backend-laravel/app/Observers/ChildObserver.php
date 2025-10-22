<?php

namespace App\Observers;

use App\Models\Child;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ChildObserver
{
    /**
     * Handle the Child "created" event.
     */
    public function created(Child $child): void
    {
        // Créer automatiquement un User pour l'enfant
        if ($child->email) {
            // Vérifier si un user avec cet email existe déjà
            $existingUser = User::where('email', $child->email)->first();
            
            if (!$existingUser) {
                // Générer un mot de passe temporaire
                $temporaryPassword = Str::random(12);
                
                User::create([
                    'name' => $child->nom_complet,
                    'email' => $child->email,
                    'password' => Hash::make($temporaryPassword),
                    'user_type' => 'child',
                    'user_id' => $child->id,
                    'temporary_password' => $temporaryPassword, // Pour l'envoyer par email
                ]);

                // TODO: Envoyer un email avec le mot de passe temporaire
                // Mail::to($child->email)->send(new WelcomeChildMail($child, $temporaryPassword));
            }
        }
    }

    /**
     * Handle the Child "updated" event.
     */
    public function updated(Child $child): void
    {
        // Si l'email de l'enfant change, mettre à jour le User
        if ($child->isDirty('email')) {
            $user = User::where('user_type', 'child')
                        ->where('user_id', $child->id)
                        ->first();
            
            if ($user) {
                $user->update([
                    'email' => $child->email,
                    'name' => $child->nom_complet,
                ]);
            }
        }
    }

    /**
     * Handle the Child "deleted" event.
     */
    public function deleted(Child $child): void
    {
        // Optionnel : Supprimer ou désactiver le User associé
        User::where('user_type', 'child')
            ->where('user_id', $child->id)
            ->delete();
    }

    /**
     * Handle the Child "restored" event.
     */
    public function restored(Child $child): void
    {
        // Optionnel : Restaurer le User si l'enfant est restauré
    }
}
