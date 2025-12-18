<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Models\Monitor;
use App\Models\WorshipReport;
use App\Models\Salle;
use App\Models\Activity;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function statistics(): JsonResponse
    {
        $monitorsStats = [
            'total' => Monitor::count(),
            'actifs' => Monitor::whereNotNull('salle_actuelle_id')->count(),
        ];

        $childrenStats = [
            'total' => Child::count(),
            'garcons' => Child::where('genre', 'Masculin')->count(),
            'filles' => Child::where('genre', 'F\u00e9minin')->count(),
        ];

        // Optimisation: Utilisation des agrégats SQL direct
        $worshipCount = WorshipReport::count();
        $worshipSum = WorshipReport::sum('effectif_total');
        // Évite la division par zéro si count est 0
        $worshipAvg = $worshipCount > 0 ? $worshipSum / $worshipCount : 0; 
        
        $worshipStats = [
            'total_cultes' => $worshipCount,
            'total_effectif' => $worshipSum,
            'moyenne_effectif' => round($worshipAvg, 1),
        ];

        // Statistiques complémentaires
        $activitiesThisMonth = Activity::whereBetween('date', [
            now()->startOfMonth()->toDateString(),
            now()->endOfMonth()->toDateString(),
        ])->count();

        $sallesActives = Salle::where('actif', true)->count();

        // Récupération des événements à venir
        $upcomingEvents = Activity::where('date', '>=', now())
            ->orderBy('date')
            ->take(5)
            ->get()
            ->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'title' => $activity->titre,
                    'date' => $activity->date,
                    'time' => $activity->heure_debut,
                    'location' => $activity->lieu,
                    'type' => 'activity'
                ];
            });

        // Activités récentes (Simulation d'un flux d'activité via aggregation)
        $recentChildren = Child::latest()->take(3)->get()->map(function ($child) {
            return [
                'id' => 'child_' . $child->id,
                'type' => 'child',
                'user' => 'Admin', // Idéalement, l'utilisateur qui a créé (si tracké)
                'action' => "a ajouté un nouvel enfant : {$child->nom} {$child->prenom}",
                'time' => $child->created_at->diffForHumans(),
                'created_at' => $child->created_at
            ];
        });

        $recentReports = WorshipReport::latest()->take(3)->get()->map(function ($report) {
            return [
                'id' => 'report_' . $report->id,
                'type' => 'report',
                'user' => 'Moniteur', // ou $report->moniteur_nom si dispo
                'action' => "a soumis un rapport de culte pour le " . $report->date,
                'time' => $report->created_at->diffForHumans(),
                'created_at' => $report->created_at
            ];
        });

        $recentCotisations = \App\Models\Cotisation::latest()->take(3)->get()->map(function ($cotisation) {
            return [
                'id' => 'cotisation_' . $cotisation->id,
                'type' => 'payment',
                'user' => $cotisation->membre_nom ?? 'Membre',
                'action' => "a payé une cotisation de {$cotisation->montant} {$cotisation->devise}",
                'time' => $cotisation->created_at->diffForHumans(),
                'created_at' => $cotisation->created_at
            ];
        });

        $recentActivities = $recentChildren->concat($recentReports)->concat($recentCotisations)
            ->sortByDesc('created_at')
            ->take(5)
            ->values();

        return response()->json([
            'monitors' => $monitorsStats,
            'children' => $childrenStats,
            'worship' => $worshipStats,
            'activities_this_month' => $activitiesThisMonth,
            'salles_actives' => $sallesActives,
            'upcoming_events' => $upcomingEvents,
            'recent_activities' => $recentActivities,
        ]);
    }
}
