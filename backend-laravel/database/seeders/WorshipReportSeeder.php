<?php

namespace Database\Seeders;

use App\Models\WorshipReport;
use App\Models\Monitor;
use Illuminate\Database\Seeder;

class WorshipReportSeeder extends Seeder
{
    public function run(): void
    {
        $predicateur = Monitor::first()?->nom_complet ?? 'Pasteur Principal';
        $moniteurs = Monitor::limit(3)->get()->pluck('nom_complet')->values()->all();
        $orateurs = [$predicateur];

        // mapping salles autorisées selon la migration
        $salle = 'Juniors';

        $reports = [
            [
                'date' => '2025-01-07',
                'salle' => $salle,
                'effectif_freres' => 120,
                'effectif_soeurs' => 130,
                'offrandes' => 'CDF 150000; USD 200',
                'nombre_nouveaux_venus' => 5,
            ],
            [
                'date' => '2025-01-14',
                'salle' => $salle,
                'effectif_freres' => 140,
                'effectif_soeurs' => 140,
                'offrandes' => 'CDF 180000; USD 250',
                'nombre_nouveaux_venus' => 3,
            ],
            [
                'date' => '2025-01-21',
                'salle' => $salle,
                'effectif_freres' => 150,
                'effectif_soeurs' => 150,
                'offrandes' => 'CDF 200000; USD 300',
                'nombre_nouveaux_venus' => 6,
            ],
            [
                'date' => '2025-01-28',
                'salle' => $salle,
                'effectif_freres' => 160,
                'effectif_soeurs' => 160,
                'offrandes' => 'CDF 220000; USD 350',
                'nombre_nouveaux_venus' => 4,
            ],
        ];

        foreach ($reports as $report) {
            WorshipReport::create([
                'date' => $report['date'],
                'salle' => $report['salle'],
                'orateurs' => json_encode($orateurs),
                'predicateur' => $predicateur,
                'moniteurs' => json_encode($moniteurs),
                'effectif_freres' => $report['effectif_freres'],
                'effectif_soeurs' => $report['effectif_soeurs'],
                'offrandes' => $report['offrandes'],
                'nombre_nouveaux_venus' => $report['nombre_nouveaux_venus'],
                'created_by' => null,
            ]);
        }
    }
}
