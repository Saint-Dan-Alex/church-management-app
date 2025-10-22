<?php

namespace Database\Seeders;

use App\Models\Expense;
use App\Models\Activity;
use App\Models\Monitor;
use Illuminate\Database\Seeder;

class ExpenseSeeder extends Seeder
{
    public function run(): void
    {
        $activity = Activity::first();
        $ajouteParMonitor = Monitor::first();

        $activityNom = $activity?->titre ?? 'Activité Générale';
        $ajouteParId = $ajouteParMonitor?->id ?? (string) str()->uuid();
        $ajouteParNom = $ajouteParMonitor?->nom_complet ?? 'Système';

        // Categories doivent correspondre aux enums de la migration: transport, repas, materiel, location, decoration, sonorisation, honoraires, cadeaux, autre
        $expenses = [
            [
                'activity_id' => $activity?->id,
                'activity_nom' => $activityNom,
                'categorie' => 'transport',
                'montant' => 150000,
                'devise' => 'CDF',
                'date' => '2025-01-15',
                'description' => 'Location de bus pour le camp',
                'ajoute_par' => $ajouteParId,
                'ajoute_par_nom' => $ajouteParNom,
            ],
            [
                'activity_id' => $activity?->id,
                'activity_nom' => $activityNom,
                'categorie' => 'repas',
                'montant' => 300000,
                'devise' => 'CDF',
                'date' => '2025-01-16',
                'description' => 'Achat de vivres pour le camp',
                'ajoute_par' => $ajouteParId,
                'ajoute_par_nom' => $ajouteParNom,
            ],
            [
                'activity_id' => $activity?->id,
                'activity_nom' => $activityNom,
                'categorie' => 'materiel',
                'montant' => 100,
                'devise' => 'USD',
                'date' => '2025-01-10',
                'description' => 'Achat de matériel didactique',
                'ajoute_par' => $ajouteParId,
                'ajoute_par_nom' => $ajouteParNom,
            ],
            [
                'activity_id' => $activity?->id,
                'activity_nom' => $activityNom,
                'categorie' => 'autre',
                'montant' => 50000,
                'devise' => 'CDF',
                'date' => '2025-01-01',
                'description' => 'Facture SNEL janvier',
                'ajoute_par' => $ajouteParId,
                'ajoute_par_nom' => $ajouteParNom,
            ],
            [
                'activity_id' => $activity?->id,
                'activity_nom' => $activityNom,
                'categorie' => 'autre',
                'montant' => 50,
                'devise' => 'USD',
                'date' => '2025-01-20',
                'description' => 'Frais administratifs',
                'ajoute_par' => $ajouteParId,
                'ajoute_par_nom' => $ajouteParNom,
            ],
        ];

        foreach ($expenses as $expense) {
            Expense::create($expense);
        }
    }
}
