<?php

namespace Database\Seeders;

use App\Models\Monitor;
use App\Models\Salle;
use Illuminate\Database\Seeder;

class MonitorSeeder extends Seeder
{
    public function run(): void
    {
        $salles = Salle::all();

        $monitors = [
            [
                'nom' => 'KABAMBA',
                'post_nom' => 'MBUYU',
                'prenom' => 'Jean',
                'date_naissance' => '1990-05-15',
                'email' => 'jean.kabamba@church.cd',
                'telephone' => '+243900000001',
                'adresse' => 'Lubumbashi, RDC',
                'date_conversion' => '2010-03-20',
                'date_bapteme' => '2010-06-15',
                'baptise_saint_esprit' => true,
                'etat_civil' => 'Marié(e)',
                'date_adhesion' => '2020-01-15',
                'salle_actuelle_id' => $salles[0]->id ?? null,
                'salle_actuelle_nom' => 'Jardin',
                'role_actuel' => 'responsable',
                'date_affectation_actuelle' => '2020-01-15',
            ],
            [
                'nom' => 'TSHISEKEDI',
                'post_nom' => 'KALALA',
                'prenom' => 'Marie',
                'date_naissance' => '1988-08-22',
                'email' => 'marie.tshisekedi@church.cd',
                'telephone' => '+243900000002',
                'adresse' => 'Kinshasa, RDC',
                'date_conversion' => '2008-05-10',
                'date_bapteme' => '2008-08-20',
                'baptise_saint_esprit' => true,
                'etat_civil' => 'Marié(e)',
                'date_adhesion' => '2019-06-10',
                'salle_actuelle_id' => $salles[1]->id ?? null,
                'salle_actuelle_nom' => 'Primaire',
                'role_actuel' => 'responsable',
                'date_affectation_actuelle' => '2019-06-10',
            ],
            [
                'nom' => 'MUKENDI',
                'post_nom' => 'WA',
                'prenom' => 'Paul',
                'date_naissance' => '1995-12-03',
                'email' => 'paul.mukendi@church.cd',
                'telephone' => '+243900000003',
                'adresse' => 'Kolwezi, RDC',
                'date_conversion' => '2015-02-14',
                'date_bapteme' => '2015-05-10',
                'baptise_saint_esprit' => true,
                'etat_civil' => 'Célibataire',
                'date_adhesion' => '2021-03-01',
                'salle_actuelle_id' => $salles[2]->id ?? null,
                'salle_actuelle_nom' => 'Adolescents',
                'role_actuel' => 'adjoint',
                'date_affectation_actuelle' => '2021-03-01',
            ],
            [
                'nom' => 'MULAMBA',
                'post_nom' => 'NGOY',
                'prenom' => 'Grace',
                'date_naissance' => '1992-07-18',
                'email' => 'grace.mulamba@church.cd',
                'telephone' => '+243900000004',
                'adresse' => 'Lubumbashi, RDC',
                'date_conversion' => '2012-09-05',
                'date_bapteme' => '2012-12-25',
                'baptise_saint_esprit' => false,
                'etat_civil' => 'Célibataire',
                'date_adhesion' => '2020-08-20',
                'salle_actuelle_id' => $salles[3]->id ?? null,
                'salle_actuelle_nom' => 'Jeunes',
                'role_actuel' => 'membre',
                'date_affectation_actuelle' => '2020-08-20',
            ],
            [
                'nom' => 'KASONGO',
                'post_nom' => 'MWAMBA',
                'prenom' => 'David',
                'date_naissance' => '1985-04-25',
                'email' => 'david.kasongo@church.cd',
                'telephone' => '+243900000005',
                'adresse' => 'Likasi, RDC',
                'date_conversion' => '2005-11-12',
                'date_bapteme' => '2006-01-08',
                'baptise_saint_esprit' => true,
                'etat_civil' => 'Marié(e)',
                'date_adhesion' => '2018-02-28',
                'salle_actuelle_id' => $salles[4]->id ?? null,
                'salle_actuelle_nom' => 'Adultes',
                'role_actuel' => 'responsable',
                'date_affectation_actuelle' => '2018-02-28',
            ],
        ];

        foreach ($monitors as $monitor) {
            Monitor::create($monitor);
        }
    }
}
