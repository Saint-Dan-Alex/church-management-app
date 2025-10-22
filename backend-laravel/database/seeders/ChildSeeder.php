<?php

namespace Database\Seeders;

use App\Models\Child;
use App\Models\Salle;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class ChildSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('fr_FR');

        $genres = ['Masculin', 'Féminin'];
        $bse = ['Oui', 'Non', 'NSP'];
        $vieJesus = ['Oui', 'Non', 'Je ne sais pas'];

        $sallesByName = Salle::all()->keyBy('nom');

        for ($i = 0; $i < 2000; $i++) {
            $genre = $faker->randomElement($genres);
            $nom = strtoupper($faker->lastName());
            $postNom = strtoupper($faker->lastName());
            $prenom = $faker->firstName($genre === 'Féminin' ? 'female' : 'male');

            $dateNaissance = $faker->dateTimeBetween('-19 years', '-3 years');
            $age = (int) $dateNaissance->diff(new \DateTime())->y;

            $salleNom = null; $salleId = null;
            if ($age >= 3 && $age <= 5) { $salleNom = 'Jardin'; }
            elseif ($age >= 6 && $age <= 7) { $salleNom = 'Ainés'; }
            elseif ($age >= 8 && $age <= 9) { $salleNom = 'Juniors'; }
            elseif ($age >= 10 && $age <= 13) { $salleNom = 'Cadets'; }
            elseif ($age >= 14 && $age <= 18) { $salleNom = 'Adolescents'; }
            if ($age > 18) { $salleNom = 'ADO PARTI'; }

            if ($salleNom && $sallesByName->has($salleNom)) {
                $salleId = $sallesByName[$salleNom]->id;
            }

            Child::create([
                'nom' => $nom,
                'post_nom' => $postNom,
                'prenom' => $prenom,
                'date_naissance' => $dateNaissance->format('Y-m-d'),
                'genre' => $genre,
                'etat_civil' => 'Célibataire',
                'adresse' => $faker->city() . ', RDC',
                'telephone' => '+2439' . $faker->numberBetween(100000000, 999999999),
                'email' => $faker->unique()->safeEmail(),
                'nom_pere' => strtoupper($faker->lastName()) . ' ' . $faker->firstNameMale(),
                'nom_mere' => strtoupper($faker->lastName()) . ' ' . $faker->firstNameFemale(),
                'telephone_parent1' => '+2439' . $faker->numberBetween(100000000, 999999999),
                'telephone_parent2' => $faker->boolean(50) ? '+2439' . $faker->numberBetween(100000000, 999999999) : null,
                'email_parents' => $faker->safeEmail(),
                'contact_urgence' => '+2439' . $faker->numberBetween(100000000, 999999999),
                'lien_contact_urgence' => $faker->randomElement(['Père','Mère','Oncle','Tante','Grand-parent']),
                'date_conversion' => $faker->optional()->date('Y-m-d'),
                'date_bapteme' => $faker->optional()->date('Y-m-d'),
                'baptise_saint_esprit' => $faker->randomElement($bse),
                'vie_donnee_a_jesus' => $faker->randomElement($vieJesus),
                'est_ouvrier' => $faker->boolean(15),
                'commission_actuelle' => null,
                'commission_souhaitee' => null,
                'date_adhesion' => $faker->optional()->date('Y-m-d'),
                'allergies_connues' => $faker->boolean(10),
                'allergies_details' => null,
                'maladies' => null,
                'traitement' => null,
                'autorisation_soins' => $faker->boolean(90),
                'salle_id' => $age > 18 ? null : $salleId,
                'salle_nom' => $salleNom,
            ]);
        }
    }
}
