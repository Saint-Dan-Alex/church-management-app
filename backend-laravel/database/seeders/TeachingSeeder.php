<?php

namespace Database\Seeders;

use App\Models\Teaching;
use Illuminate\Database\Seeder;

class TeachingSeeder extends Seeder
{
    public function run(): void
    {
        $teachings = [
            [
                'date_seance' => '2025-01-07',
                'theme' => 'La Foi qui Déplace les Montagnes',
                'sous_theme' => null,
                'sujet' => 'Comprendre la foi qui agit',
                'textes_bibliques' => 'Matthieu 17:20; Hébreux 11',
                'but_pedagogique' => 'Encourager les enfants à exercer leur foi au quotidien',
                'verset_retenir' => 'Hébreux 11:1',
                'materiel_didactique' => 'Bible, images, caillou',
                'sujet_revision' => null,
                'sensibilisation' => 'Questions sur des défis du quotidien',
                'questions_reponses' => null,
                'question_decouverte' => null,
                'reponse_decouverte' => null,
                'type_contenu' => 'points_developper',
                'conclusion' => 'Dieu honore la foi',
            ],
            [
                'date_seance' => '2025-01-14',
                'theme' => 'L\'Amour de Dieu',
                'sous_theme' => 'Dieu nous aime',
                'sujet' => 'Découvrir l\'amour inconditionnel de Dieu',
                'textes_bibliques' => 'Jean 3:16; 1 Jean 4:8',
                'but_pedagogique' => 'Comprendre que Dieu aime chaque enfant',
                'verset_retenir' => 'Jean 3:16',
                'materiel_didactique' => null,
                'sujet_revision' => null,
                'sensibilisation' => null,
                'questions_reponses' => null,
                'question_decouverte' => null,
                'reponse_decouverte' => null,
                'type_contenu' => 'developpement',
                'conclusion' => 'Dieu aime le monde',
            ],
            [
                'date_seance' => '2025-01-21',
                'theme' => 'La Prière Efficace',
                'sous_theme' => null,
                'sujet' => 'Apprendre à prier avec foi',
                'textes_bibliques' => 'Jacques 5:16; Matthieu 6:9-13',
                'but_pedagogique' => 'Encourager à prier chaque jour',
                'verset_retenir' => 'Jacques 5:16',
                'materiel_didactique' => null,
                'sujet_revision' => null,
                'sensibilisation' => null,
                'questions_reponses' => null,
                'question_decouverte' => null,
                'reponse_decouverte' => null,
                'type_contenu' => 'points_developper',
                'conclusion' => null,
            ],
            [
                'date_seance' => '2025-01-28',
                'theme' => 'La Puissance du Saint-Esprit',
                'sous_theme' => null,
                'sujet' => 'Qui est le Saint-Esprit ?',
                'textes_bibliques' => 'Actes 1:8; Jean 14:26',
                'but_pedagogique' => 'Découvrir le rôle du Saint-Esprit',
                'verset_retenir' => 'Actes 1:8',
                'materiel_didactique' => null,
                'sujet_revision' => null,
                'sensibilisation' => null,
                'questions_reponses' => null,
                'question_decouverte' => null,
                'reponse_decouverte' => null,
                'type_contenu' => 'developpement',
                'conclusion' => null,
            ],
        ];

        foreach ($teachings as $teaching) {
            Teaching::create($teaching);
        }
    }
}
