<?php

namespace Database\Seeders;

use App\Models\Salle;
use Illuminate\Database\Seeder;

class SalleSeeder extends Seeder
{
    public function run(): void
    {
        $salles = [
            ['nom' => 'Jardin', 'description' => '3-5 ans', 'capacite' => 30, 'actif' => true],
            ['nom' => 'Ainés', 'description' => '6-7 ans', 'capacite' => 40, 'actif' => true],
            ['nom' => 'Juniors', 'description' => '8-9 ans', 'capacite' => 50, 'actif' => true],
            ['nom' => 'Cadets', 'description' => '10-13 ans', 'capacite' => 60, 'actif' => true],
            ['nom' => 'Adolescents', 'description' => '14-18 ans', 'capacite' => 80, 'actif' => true],
        ];

        foreach ($salles as $salle) {
            Salle::create($salle);
        }
    }
}
