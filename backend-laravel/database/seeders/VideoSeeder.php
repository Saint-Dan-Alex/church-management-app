<?php

namespace Database\Seeders;

use App\Models\Video;
use Illuminate\Database\Seeder;

class VideoSeeder extends Seeder
{
    public function run(): void
    {
        $videos = [
            [
                'titre' => 'Enseignement: Les Héros de la Bible',
                'description' => 'Série d\'enseignements sur les grands personnages bibliques pour enfants',
                'url' => 'https://youtube.com/watch?v=example1',
                'category' => 'Enseignement',
                'date_enregistrement' => '2025-01-15',
                'is_featured' => true,
                'views' => 450,
            ],
            [
                'titre' => 'Camp 2024 - Highlights',
                'description' => 'Meilleurs moments du camp de vacances 2024',
                'url' => 'https://youtube.com/watch?v=example2',
                'category' => 'Événements',
                'date_enregistrement' => '2024-08-20',
                'is_featured' => true,
                'views' => 680,
            ],
            [
                'titre' => 'Louange Enfants - Janvier 2025',
                'description' => 'Session de louange des enfants',
                'url' => 'https://youtube.com/watch?v=example3',
                'category' => 'Louange',
                'date_enregistrement' => '2025-01-05',
                'is_featured' => false,
                'views' => 210,
            ],
            [
                'titre' => 'Témoignage: Guérison Miraculeuse',
                'description' => 'Témoignage d\'un enfant guéri miraculeusement',
                'url' => 'https://youtube.com/watch?v=example4',
                'category' => 'Témoignages',
                'date_enregistrement' => '2024-12-10',
                'is_featured' => false,
                'views' => 520,
            ],
        ];

        foreach ($videos as $video) {
            Video::create($video);
        }
    }
}
