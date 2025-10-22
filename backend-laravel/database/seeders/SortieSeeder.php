<?php

namespace Database\Seeders;

use App\Models\Sortie;
use App\Models\Monitor;
use Illuminate\Database\Seeder;

class SortieSeeder extends Seeder
{
    public function run(): void
    {
        $user = Monitor::first();
        $enregistrePar = $user?->id ?? (string) str()->uuid();
        $enregistreParNom = $user?->nom_complet ?? 'Système';

        $sorties = [
            [
                'libelle' => 'Loyer locaux église',
                'categorie' => 'loyer',
                'montant' => 500000,
                'devise' => 'CDF',
                'date_sortie' => '2025-01-01',
                'description' => 'Loyer mensuel locaux église',
                'beneficiaire' => null,
                'reference' => null,
                'remarque' => null,
                'enregistre_par' => $enregistrePar,
                'enregistre_par_nom' => $enregistreParNom,
            ],
            [
                'libelle' => 'Salaire gardien',
                'categorie' => 'salaires',
                'montant' => 300,
                'devise' => 'USD',
                'date_sortie' => '2025-01-10',
                'description' => 'Salaire gardien',
                'beneficiaire' => null,
                'reference' => null,
                'remarque' => null,
                'enregistre_par' => $enregistrePar,
                'enregistre_par_nom' => $enregistreParNom,
            ],
            [
                'libelle' => 'Réparation son',
                'categorie' => 'reparations',
                'montant' => 150000,
                'devise' => 'CDF',
                'date_sortie' => '2025-01-15',
                'description' => 'Réparation système son',
                'beneficiaire' => null,
                'reference' => null,
                'remarque' => null,
                'enregistre_par' => $enregistrePar,
                'enregistre_par_nom' => $enregistreParNom,
            ],
            [
                'libelle' => 'Achat fournitures bureau',
                'categorie' => 'fournitures',
                'montant' => 75000,
                'devise' => 'CDF',
                'date_sortie' => '2025-01-20',
                'description' => 'Achat papiers et stylos',
                'beneficiaire' => null,
                'reference' => null,
                'remarque' => null,
                'enregistre_par' => $enregistrePar,
                'enregistre_par_nom' => $enregistreParNom,
            ],
            [
                'libelle' => 'Carburant véhicule',
                'categorie' => 'transport',
                'montant' => 50,
                'devise' => 'USD',
                'date_sortie' => '2025-01-25',
                'description' => 'Carburant véhicule église',
                'beneficiaire' => null,
                'reference' => null,
                'remarque' => null,
                'enregistre_par' => $enregistrePar,
                'enregistre_par_nom' => $enregistreParNom,
            ],
        ];

        foreach ($sorties as $sortie) {
            Sortie::create($sortie);
        }
    }
}
