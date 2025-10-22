<?php

namespace Database\Seeders;

use App\Models\Payment;
use App\Models\Activity;
use App\Models\Child;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        // Choisir une activité (priorité aux payantes) et un enfant comme participant
        $activity = Activity::where('type', 'payante')->first() ?? Activity::first();
        $child = Child::first();

        if (!$activity || !$child) {
            return;
        }

        $baseNumero = Str::upper(Str::random(6));
        $today = now();

        $rows = [
            [
                'montant' => $activity->montant_requis ?? 0,
                'montant_paye' => 50000,
                'devise' => 'CDF',
                'statut' => 'paid',
                'created_at' => $today->copy()->subDays(5),
            ],
            [
                'montant' => $activity->montant_requis ?? 0,
                'montant_paye' => 25000,
                'devise' => 'CDF',
                'statut' => 'partial',
                'created_at' => $today->copy()->subDays(3),
            ],
            [
                'montant' => $activity->montant_requis ?? 0,
                'montant_paye' => 50,
                'devise' => 'USD',
                'statut' => 'paid',
                'created_at' => $today->copy()->subDays(2),
            ],
            [
                'montant' => $activity->montant_requis ?? 0,
                'montant_paye' => 0,
                'devise' => 'CDF',
                'statut' => 'pending',
                'created_at' => $today->copy()->subDays(1),
            ],
            [
                'montant' => $activity->montant_requis ?? 0,
                'montant_paye' => 50000,
                'devise' => 'CDF',
                'statut' => 'paid',
                'created_at' => $today,
            ],
        ];

        foreach ($rows as $i => $data) {
            Payment::create([
                'activity_id' => $activity->id,
                'activity_nom' => $activity->titre ?? 'Activité',
                'participant_id' => $child->id,
                'participant_nom' => $child->nom,
                'participant_prenom' => $child->prenom,
                'participant_nom_complet' => $child->nom_complet,
                'montant' => $data['montant'],
                'montant_paye' => $data['montant_paye'],
                'devise' => $data['devise'],
                'statut' => $data['statut'],
                'methode_paiement' => 'cash',
                'date_echeance' => $today->copy()->addDays(7),
                'date_paiement' => $data['statut'] === 'paid' ? $data['created_at'] : null,
                'numero_paiement' => $baseNumero.$i.now()->format('His'),
                'numero_recu' => null,
                'remarque' => null,
                'created_at' => $data['created_at'],
                'updated_at' => $data['created_at'],
            ]);
        }
    }
}
