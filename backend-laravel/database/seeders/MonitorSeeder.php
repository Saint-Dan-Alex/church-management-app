<?php

namespace Database\Seeders;

use App\Models\Monitor;
use App\Models\Salle;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class MonitorSeeder extends Seeder
{
    public function run(): void
    {
        $salles = Salle::all()->values();
        $faker = Faker::create('fr_FR');

        $roles = ['responsable', 'adjoint', 'membre'];
        $etats = ['Célibataire', 'Marié(e)', 'Veuf(ve)', 'Divorcé(e)'];

        for ($i = 0; $i < 100; $i++) {
            $salle = $salles[$i % max(1, $salles->count())] ?? null;
            $prenom = $faker->firstName();
            $nom = strtoupper($faker->lastName());
            $postNom = strtoupper($faker->lastName());

            Monitor::create([
                'nom' => $nom,
                'post_nom' => $postNom,
                'prenom' => $prenom,
                'date_naissance' => $faker->dateTimeBetween('-45 years', '-20 years')->format('Y-m-d'),
                'email' => $faker->unique()->safeEmail(),
                'telephone' => '+2439' . $faker->numberBetween(100000000, 999999999),
                'adresse' => $faker->city() . ', RDC',
                'date_conversion' => $faker->optional()->date('Y-m-d'),
                'date_bapteme' => $faker->optional()->date('Y-m-d'),
                'baptise_saint_esprit' => $faker->boolean(70),
                'etat_civil' => $faker->randomElement($etats),
                'date_adhesion' => $faker->dateTimeBetween('-10 years', '-1 years')->format('Y-m-d'),
                'salle_actuelle_id' => $salle?->id,
                'salle_actuelle_nom' => $salle?->nom,
                'role_actuel' => $faker->randomElement($roles),
                'date_affectation_actuelle' => $faker->dateTimeBetween('-5 years', 'now')->format('Y-m-d'),
            ]);
        }
    }
}
