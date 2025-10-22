<?php

namespace Database\Seeders;

use App\Models\Salle;
use Illuminate\Database\Seeder;

class SalleSeeder extends Seeder
{
    public function run(): void
    {
        $salles = [
            [
                'nom' => 'Jardin',
                'description' => 'Salle pour les plus petits (3-5 ans)',
                'capacite' => 30,
                'actif' => true,
            ],
            [
                'nom' => 'Primaire',
                'description' => 'Salle pour les enfants du primaire (6-12 ans)',
                'capacite' => 50,
                'actif' => true,
            ],
            [
                'nom' => 'Adolescents',
                'description' => 'Salle pour les adolescents (13-17 ans)',
                'capacite' => 40,
                'actif' => true,
            ],
            [
                'nom' => 'Jeunes',
                'description' => 'Salle pour les jeunes adultes (18-25 ans)',
                'capacite' => 60,
                'actif' => true,
            ],
            [
                'nom' => 'Adultes',
                'description' => 'Salle principale pour les adultes',
                'capacite' => 100,
                'actif' => true,
            ],
        ];

        foreach ($salles as $salle) {
            Salle::create($salle);
        }
    }
}
