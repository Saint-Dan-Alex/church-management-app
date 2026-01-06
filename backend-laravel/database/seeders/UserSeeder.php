<?php

namespace Database\Seeders;

use App\Models\Monitor;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. ADMIN (Pas de Monitor, juste User)
        $this->createUser(
            'Admin Principal',
            'sdasoftware75@gmail.com',
            'ADMIN'
        );

        // 2. COORDINATION (Monitor + User)
        $this->createMonitorUser(
            'Saint',
            'Dan Alex',
            'saintdanalex@gmail.com',
            'COORDINATION'
        );

        // 3. CHEF_SALLE (Monitor + User)
        $this->createMonitorUser(
            'Kabuya',
            'Dan',
            'dankabuya48@gmail.com',
            'CHEF_SALLE'
        );

        // 4. MONITEUR (Monitor + User)
        $this->createMonitorUser(
            'Kabuya',
            'Daniel',
            'kabuyadan5@gmail.com',
            'MONITEUR'
        );

        // 5. FINANCIER (Monitor + User)
        $this->createMonitorUser(
            'Weezy',
            'Papa',
            'papaweezy162@gmail.com',
            'FINANCIER'
        );

        // 6. COM_ACTIVITES (Monitor + User)
        $this->createMonitorUser(
            'Saint',
            'Alexander',
            'saintdanalexander@gmail.com',
            'COM_ACTIVITES'
        );
        
        // 7. PARENT (User simple)
         $this->createUser(
            'Kabuya Parent',
            'kabuyakabongo640@gmail.com',
            'PARENT'
        );
    }

    private function createUser(string $name, string $email, string $role)
    {
        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
                'active' => true,
            ]
        );

        $user->syncRoles([$role]);
        $this->command->info("User {$role} created: {$email}");
    }

    private function createMonitorUser(string $nom, string $prenom, string $email, string $role)
    {
        // 1. Créer le Monitor
        $monitor = Monitor::updateOrCreate(
            ['email' => $email],
            [
                'nom' => $nom,
                'prenom' => $prenom,
                'telephone' => '0000000000',
                'date_conversion' => now(),
                'date_adhesion' => now(),
            ]
        );

        // 2. Créer le User lié
        $user = User::updateOrCreate(
            ['email' => $email], // On lie par l'email
            [
                'name' => "{$prenom} {$nom}",
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
                'active' => true,
                // Liaison Polymorphique
                'user_type' => 'monitor',
                'user_id' => $monitor->id,
            ]
        );

        $user->syncRoles([$role]);
        $this->command->info("Monitor-User {$role} created: {$email}");
    }
}
