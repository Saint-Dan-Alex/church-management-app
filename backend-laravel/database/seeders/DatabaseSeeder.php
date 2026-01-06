<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // L'ordre est IMPORTANT : Salle doit être créé avant Monitor
        // car Monitor a une relation avec Salle

        $this->call([

            AdminSeeder::class,
            RolesAndPermissionsSeeder::class,
            UserSeeder::class,
            // 1. Salles (en premier - pas de dépendances)
            // SalleSeeder::class,

            // 2. Monitors et Children (créent automatiquement des Users via Observer)
            // MonitorSeeder::class,
            // ChildSeeder::class,

            // 3. Activities (dépend de Monitor pour responsable_id)
            // ActivitySeeder::class,

            // 4. Modules financiers et opérationnels
            // PaymentSeeder::class,
            // ExpenseSeeder::class,
            // PresenceSeeder::class,
            // CotisationSeeder::class,
            // SortieSeeder::class,

            // 5. Contenus et médias
            // BlogSeeder::class,
            // VideoSeeder::class,
            // PhotoSeeder::class,

            // 6. Enseignements et rapports
            // TeachingSeeder::class,
            // WorshipReportSeeder::class,
            // 7. Admin par défaut

        ]);

        // Réaffecter les salles des enfants selon l'âge après insertion
        Artisan::call('children:reassign-salles');

        // $this->command->info('✅ Base de données peuplée avec succès !');
        // $this->command->info('📊 Résumé :');
        // $this->command->info('   - 5 Salles créées');
        // $this->command->info('   - 5 Moniteurs créés (+ 5 Users auto)');
        // $this->command->info('   - 5 Enfants créés (+ 5 Users auto)');
        // $this->command->info('   - 5 Activités créées');
        $this->command->info('   - Données de test pour tous les modules');
    }
}
