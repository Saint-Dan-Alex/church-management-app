<?php

namespace Database\Seeders;

use App\Models\Cotisation;
use App\Models\Monitor;
use Illuminate\Database\Seeder;

class CotisationSeeder extends Seeder
{
    public function run(): void
    {
        $enregistreur = Monitor::first();
        $enregistreParId = $enregistreur?->id ?? (string) str()->uuid();
        $enregistreParNom = $enregistreur?->nom_complet ?? 'Système';

        $cotisations = [
            [
                'membre_nom' => 'Fonds Moniteurs',
                'type_cotisation' => 'mensuelle',
                'montant' => 10000,
                'devise' => 'CDF',
                'date_cotisation' => '2025-01-05',
                'mois' => 'Janvier',
                'annee' => '2025',
                'enregistre_par' => $enregistreParId,
                'enregistre_par_nom' => $enregistreParNom,
                'remarque' => 'Cotisation mensuelle des moniteurs',
            ],
            [
                'membre_nom' => 'Fonds Moniteurs',
                'type_cotisation' => 'mensuelle',
                'montant' => 10,
                'devise' => 'USD',
                'date_cotisation' => '2025-01-05',
                'mois' => 'Janvier',
                'annee' => '2025',
                'enregistre_par' => $enregistreParId,
                'enregistre_par_nom' => $enregistreParNom,
                'remarque' => 'Cotisation mensuelle devise USD',
            ],
            [
                'membre_nom' => 'Camp Vacances',
                'type_cotisation' => 'speciale',
                'montant' => 50000,
                'devise' => 'CDF',
                'date_cotisation' => '2025-02-10',
                'mois' => 'Février',
                'annee' => '2025',
                'enregistre_par' => $enregistreParId,
                'enregistre_par_nom' => $enregistreParNom,
                'remarque' => 'Cotisation spéciale pour le camp',
            ],
            [
                'membre_nom' => 'Fonds Moniteurs',
                'type_cotisation' => 'mensuelle',
                'montant' => 10000,
                'devise' => 'CDF',
                'date_cotisation' => '2025-02-05',
                'mois' => 'Février',
                'annee' => '2025',
                'enregistre_par' => $enregistreParId,
                'enregistre_par_nom' => $enregistreParNom,
            ],
            [
                'membre_nom' => 'Cotisation Annuelle',
                'type_cotisation' => 'annuelle',
                'montant' => 100,
                'devise' => 'USD',
                'date_cotisation' => '2025-01-01',
                'mois' => 'Janvier',
                'annee' => '2025',
                'enregistre_par' => $enregistreParId,
                'enregistre_par_nom' => $enregistreParNom,
            ],
        ];

        foreach ($cotisations as $cotisation) {
            Cotisation::create($cotisation);
        }
    }
}
