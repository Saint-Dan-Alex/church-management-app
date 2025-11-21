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
                'id' => '1',
                'title' => 'École du Dimanche',
                'description' => 'Enseignement biblique pour les enfants',
                'date' => '2024-10-20',
                'time' => '09:00',
                'duration' => '1h',
                'location' => 'Salle Enfants',
                'category' => 'Enfants',
                'type' => 'gratuite',
                'participants' => 56,
                'maxParticipants' => 80,
                'status' => 'upcoming',
                'organizer' => 'Sophie Bernard',
            ],
            [
                'id' => '2',
                'title' => 'Réunion de Prière',
                'description' => 'Temps de prière collective',
                'date' => '2024-10-18',
                'time' => '19:00',
                'duration' => '1h30',
                'location' => 'Salle Principale',
                'category' => 'Prière',
                'type' => 'gratuite',
                'participants' => 45,
                'maxParticipants' => 100,
                'status' => 'upcoming',
                'organizer' => 'Jean Martin',
            ],
            [
                'id' => '3',
                'title' => 'Groupe de Jeunesse',
                'description' => 'Rencontre et partage pour les jeunes',
                'date' => '2024-10-19',
                'time' => '18:30',
                'duration' => '2h',
                'location' => 'Salle Jeunesse',
                'category' => 'Jeunesse',
                'type' => 'gratuite',
                'participants' => 32,
                'maxParticipants' => 50,
                'status' => 'upcoming',
                'organizer' => 'Paul Durand',
            ],
        ];

        foreach ($activities as $activity) {
            Activity::create($activity);
        }
    }
}
