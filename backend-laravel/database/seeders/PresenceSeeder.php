<?php

namespace Database\Seeders;

use App\Models\Presence;
use App\Models\Activity;
use App\Models\Monitor;
use Illuminate\Database\Seeder;

class PresenceSeeder extends Seeder
{
    public function run(): void
    {
        $activity = Activity::first();
        $monitors = Monitor::all();

        if (!$activity || $monitors->isEmpty()) {
            return;
        }

        $statuts = ['present', 'absent', 'retard', 'excuse'];

        foreach ($monitors->take(3) as $index => $monitor) {
            Presence::create([
                'activity_id' => $activity->id,
                'activity_nom' => $activity->titre ?? 'Activité',
                'moniteur_id' => $monitor->id,
                'moniteur_nom' => $monitor->nom,
                'moniteur_prenom' => $monitor->prenom,
                'moniteur_nom_complet' => $monitor->nom_complet,
                'date_presence' => now()->subDays(2),
                'heure_arrivee' => '08:00:00',
                'heure_depart' => null,
                'statut' => $statuts[$index % 4],
                'mode_enregistrement' => 'manuel',
                'remarque' => ($statuts[$index % 4] === 'retard') ? 'Arrivé 15 min en retard' : null,
            ]);
        }
    }
}
