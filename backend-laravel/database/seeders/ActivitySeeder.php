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

        $titles = [
            "Journée d’évaluation et de prière des serviteurs/moniteurs",
            "Retraite avec la jeunesse : La puissance de la résurrection",
            "Descente évangélique entre moniteurs et enfants ouvriers",
            "Journée de la femme avec les jeunes filles, les mamans et la jeunesse",
            "Retraite des serviteurs avec les ouvriers cadets et ados",
            "Célébration de la Pâques dans les différentes salles",
            "Nuit de prière avec les ados partants",
            "Dernier culte avec les ados partants",
            "Culte de célébration de l’anniversaire de l’Arche",
            "Présentation des ados partants dans la grande salle",
            "Excursion des serviteurs",
            "Descente évangélique",
            "Journée d’adoration des enfants et adolescents (ADORA 2025)",
            "Convention missionnaire de l’église Arche/Masina",
            "Journées de prière avec les enfants et ados",
            "Nuit de prière avec les ados",
            "Dédicace de l’année scolaire",
            "Descente évangélique avec les ouvriers",
            "Retraite des serviteurs",
            "Camp biblique YEKOLA",
            "Célébration de la Nativité de Jésus-Christ",
        ];

        $baseDate = now()->startOfYear()->addMonth(1); // Février de l'année courante
        $rows = [];
        foreach ($titles as $idx => $t) {
            $d = (clone $baseDate)->addDays($idx * 7); // espacées d'une semaine
            $payante = str_contains(mb_strtolower($t), 'camp') || str_contains(mb_strtolower($t), 'excursion') || str_contains(mb_strtolower($t), 'convention');
            $rows[] = [
                'titre' => $t,
                'description' => $t,
                'type' => $payante ? 'payante' : 'gratuite',
                'date' => $d->format('Y-m-d'),
                'heure_debut' => '09:00',
                'heure_fin' => '16:00',
                'lieu' => 'Église Principale',
                'responsable' => $responsable?->nom_complet ?? 'Comité Écodim',
                'responsable_id' => $responsable?->id,
                'montant_requis' => $payante ? 30000 : null,
                'devise' => $payante ? 'CDF' : null,
                'montant_alternatif' => $payante ? 30 : null,
                'devise_alternative' => $payante ? 'USD' : null,
                'statut' => 'planifiee',
            ];
        }

        foreach ($rows as $activity) {
            Activity::create($activity);
        }
    }
}
