<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Crée ou met à jour un compte administrateur par défaut
        User::updateOrCreate(
            ['email' => 'admin@church.com'],
            [
                'name' => 'Admin',
                // Le cast 'password' => 'hashed' dans le modèle User va hasher automatiquement ce mot de passe
                'password' => 'password',
                'user_type' => 'admin',
                'user_id' => null,
                'temporary_password' => null,
            ]
        );
    }
}
