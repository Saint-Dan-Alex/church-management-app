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

        $worshipReports = WorshipReport::all();

        $worshipStats = [
            'total_cultes' => $worshipReports->count(),
            'total_effectif' => $worshipReports->sum('effectif_total'),
            'moyenne_effectif' => $worshipReports->avg('effectif_total'),
        ];

        // Statistiques complémentaires
        $activitiesThisMonth = Activity::whereBetween('date', [
            now()->startOfMonth()->toDateString(),
            now()->endOfMonth()->toDateString(),
        ])->count();

        $sallesActives = Salle::where('actif', true)->count();

        return response()->json([
            'monitors' => $monitorsStats,
            'children' => $childrenStats,
            'worship' => $worshipStats,
            'activities_this_month' => $activitiesThisMonth,
            'salles_actives' => $sallesActives,
        ]);
    }
}
