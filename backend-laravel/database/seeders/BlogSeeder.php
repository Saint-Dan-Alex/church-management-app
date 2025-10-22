<?php

namespace Database\Seeders;

use App\Models\Blog;
use App\Models\Monitor;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    public function run(): void
    {
        $author = Monitor::first()?->nom_complet ?? 'Système';

        $blogs = [
            [
                'title' => 'La Foi des Enfants',
                'excerpt' => 'Cultiver la foi dès le jeune âge.',
                'content' => 'Article sur l\'importance de cultiver la foi chez les enfants dès leur jeune âge...',
                'status' => 'published',
                'category' => 'Enseignement',
                'author' => $author,
                'views' => 150,
                'published_at' => now()->subDays(10),
            ],
            [
                'title' => 'Témoignage: Camp de Vacances 2024',
                'excerpt' => 'Retour en images sur le camp 2024.',
                'content' => 'Retour en images sur le camp de vacances qui a transformé la vie de plusieurs enfants...',
                'status' => 'published',
                'category' => 'Témoignages',
                'author' => $author,
                'views' => 230,
                'published_at' => now()->subDays(5),
            ],
            [
                'title' => 'Nouveauté: Plateforme de Gestion',
                'excerpt' => 'Nouvelle plateforme de gestion.',
                'content' => 'Découvrez notre nouvelle plateforme de gestion pour faciliter le suivi des enfants...',
                'status' => 'draft',
                'category' => 'Actualités',
                'author' => $author,
                'views' => 0,
                'published_at' => null,
            ],
            [
                'title' => 'Prière pour les Enfants',
                'excerpt' => 'Guide de prière pour les enfants.',
                'content' => 'Guide pratique pour prier efficacement pour le développement spirituel des enfants...',
                'status' => 'published',
                'category' => 'Spiritualité',
                'author' => $author,
                'views' => 320,
                'published_at' => now()->subDays(15),
            ],
        ];

        foreach ($blogs as $blog) {
            Blog::create($blog);
        }
    }
}
