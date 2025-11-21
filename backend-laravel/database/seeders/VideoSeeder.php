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
                'id' => '1',
                'titre' => 'Culte du dimanche - 15 janvier 2025',
                'description' => 'Message sur la foi',
                'miniature' => '/placeholder.svg',
                'url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'type' => 'youtube',
                'categorie' => 'Cultes',
                'duree' => '1h 30min',
                'date' => '2025-01-15',
                'auteur' => 'Admin',
                'vues' => 145,
            ],
            [
                'id' => '2',
                'titre' => 'Témoignage de Marie LENGE',
                'description' => 'Transformation par la prière',
                'miniature' => '/placeholder.svg',
                'url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'type' => 'youtube',
                'categorie' => 'Témoignages',
                'duree' => '15min',
                'date' => '2025-01-10',
                'auteur' => 'Marie LENGE',
                'vues' => 89,
            ],
        ];

        foreach ($videos as $video) {
            Video::create($video);
        }
    }
}
