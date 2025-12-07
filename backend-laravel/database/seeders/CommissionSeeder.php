<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Commission;

class CommissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $commissions = [
            ['nom' => 'Louange', 'description' => 'Commission de louange et adoration'],
            ['nom' => 'Accueil', 'description' => 'Commission d\'accueil et hospitalité'],
            ['nom' => 'Technique', 'description' => 'Commission technique (son, lumière, vidéo)'],
            ['nom' => 'Intercession', 'description' => 'Commission d\'intercession et prière'],
            ['nom' => 'Enseignement', 'description' => 'Commission d\'enseignement et formation'],
        ];

        foreach ($commissions as $commission) {
            Commission::firstOrCreate(
                ['nom' => $commission['nom']],
                ['description' => $commission['description']]
            );
        }
    }
}
