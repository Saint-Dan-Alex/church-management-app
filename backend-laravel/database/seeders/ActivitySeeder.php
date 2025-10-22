<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Monitor;
use Illuminate\Database\Seeder;

class ActivitySeeder extends Seeder
{
    public function run(): void
    {
        $monitors = Monitor::all();
        $responsable = $monitors->first();

        $activities = [
            [
                'titre' => 'Camp de Vacances 2025',
                'description' => 'Camp d\'été pour les enfants avec activités spirituelles et récréatives',
                'type' => 'payante',
                'date' => '2025-07-15',
                'heure_debut' => '08:00',
                'heure_fin' => '17:00',
                'lieu' => 'Centre Kivuli, Lubumbashi',
                'responsable' => $responsable?->nom_complet ?? 'Pastor John',
                'responsable_id' => $responsable?->id,
                'montant_requis' => 50000,
                'devise' => 'CDF',
                'montant_alternatif' => 50,
                'devise_alternative' => 'USD',
                'statut' => 'planifiee',
            ],
            [
                'titre' => 'Sortie Piscine',
                'description' => 'Journée détente à la piscine pour les adolescents',
                'type' => 'payante',
                'date' => '2025-06-20',
                'heure_debut' => '10:00',
                'heure_fin' => '16:00',
                'lieu' => 'Piscine Olympique, Lubumbashi',
                'responsable' => $responsable?->nom_complet ?? 'Marie TSHISEKEDI',
                'responsable_id' => $responsable?->id,
                'montant_requis' => 20000,
                'devise' => 'CDF',
                'montant_alternatif' => 20,
                'devise_alternative' => 'USD',
                'statut' => 'planifiee',
            ],
            [
                'titre' => 'Journée de Prière',
                'description' => 'Journée de jeûne et prière pour les enfants',
                'type' => 'gratuite',
                'date' => '2025-05-10',
                'heure_debut' => '09:00',
                'heure_fin' => '15:00',
                'lieu' => 'Église Principale',
                'responsable' => $responsable?->nom_complet ?? 'Paul MUKENDI',
                'responsable_id' => $responsable?->id,
                'statut' => 'terminee',
            ],
            [
                'titre' => 'Fête de Noël',
                'description' => 'Célébration de Noël avec spectacles et cadeaux',
                'type' => 'gratuite',
                'date' => '2024-12-25',
                'heure_debut' => '14:00',
                'heure_fin' => '18:00',
                'lieu' => 'Salle des Fêtes',
                'responsable' => $responsable?->nom_complet ?? 'David KASONGO',
                'responsable_id' => $responsable?->id,
                'statut' => 'terminee',
            ],
            [
                'titre' => 'Séminaire Jeunesse',
                'description' => 'Formation sur le leadership chrétien pour les jeunes',
                'type' => 'payante',
                'date' => '2025-08-05',
                'heure_debut' => '08:30',
                'heure_fin' => '17:30',
                'lieu' => 'Centre de Conférence',
                'responsable' => $responsable?->nom_complet ?? 'Grace MULAMBA',
                'responsable_id' => $responsable?->id,
                'montant_requis' => 30000,
                'devise' => 'CDF',
                'montant_alternatif' => 30,
                'devise_alternative' => 'USD',
                'statut' => 'planifiee',
            ],
        ];

        foreach ($activities as $activity) {
            Activity::create($activity);
        }
    }
}
