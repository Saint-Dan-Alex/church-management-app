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
                'titre' => 'Camp 2024 - Jour 1',
                'description' => 'Photos du premier jour du camp',
                'url' => 'https://example.com/photos/camp2024_day1.jpg',
                'album' => 'Camp 2024',
                'date_prise' => '2024-08-15',
            ],
            [
                'titre' => 'Fête de Noël 2024',
                'description' => 'Célébration de Noël avec les enfants',
                'url' => 'https://example.com/photos/noel2024.jpg',
                'album' => 'Noël 2024',
                'date_prise' => '2024-12-25',
            ],
            [
                'titre' => 'Baptêmes Janvier 2025',
                'description' => 'Photos des baptêmes d\'eau',
                'url' => 'https://example.com/photos/baptemes_jan2025.jpg',
                'album' => 'Baptêmes 2025',
                'date_prise' => '2025-01-07',
            ],
            [
                'titre' => 'Sortie Piscine',
                'description' => 'Journée à la piscine avec les ados',
                'url' => 'https://example.com/photos/piscine.jpg',
                'album' => 'Sorties 2025',
                'date_prise' => '2025-03-15',
            ],
            [
                'titre' => 'Spectacle de Pâques',
                'description' => 'Pièce de théâtre sur la résurrection',
                'url' => 'https://example.com/photos/paques2025.jpg',
                'album' => 'Pâques 2025',
                'date_prise' => '2025-04-20',
            ],
        ];

        foreach ($photos as $photo) {
            Photo::create($photo);
        }
    }
}
