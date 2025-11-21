<?php

namespace Database\Seeders;

use App\Models\Photo;
use Illuminate\Database\Seeder;

class PhotoSeeder extends Seeder
{
    public function run(): void
    {
        $photos = [
            [
                'id' => '1',
                'titre' => 'Culte du dimanche',
                'description' => 'Photo du culte du 15 janvier 2025',
                'url' => '/placeholder.svg',
                'album' => 'Cultes',
                'date' => '2025-01-15',
                'auteur' => 'Admin',
            ],
            [
                'id' => '2',
                'titre' => 'Camp de vacances',
                'description' => 'Groupe d\'enfants au camp',
                'url' => '/placeholder.svg',
                'album' => 'Camps',
                'date' => '2024-12-20',
                'auteur' => 'Marie LENGE',
            ],
            [
                'id' => '3',
                'titre' => 'Réunion des moniteurs',
                'description' => 'Formation mensuelle',
                'url' => '/placeholder.svg',
                'album' => 'Formations',
                'date' => '2025-01-10',
                'auteur' => 'Paul NGEA',
            ],
        ];

        foreach ($photos as $photo) {
            Photo::create($photo);
        }
    }
}
