<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWorshipReportRequest;
use App\Models\WorshipReport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WorshipReportController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = WorshipReport::with('nouveauxVenus');

        if ($request->has('salle')) {
            $query->where('salle', $request->salle);
        }

        if ($request->has('date_debut') && $request->has('date_fin')) {
            $query->whereBetween('date', [$request->date_debut, $request->date_fin]);
        }

        $perPage = $request->get('per_page', 15);
        $reports = $query->orderBy('date', 'desc')->paginate($perPage);

        return response()->json($reports);
    }

    public function store(StoreWorshipReportRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $report = WorshipReport::create($request->except('nouveaux_venus'));

            if ($request->has('nouveaux_venus')) {
                foreach ($request->nouveaux_venus as $nouveauVenu) {
                    $report->nouveauxVenus()->create($nouveauVenu);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Rapport de culte créé avec succès',
                'data' => $report->load('nouveauxVenus')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors de la création',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(WorshipReport $worshipReport): JsonResponse
    {
        $worshipReport->load('nouveauxVenus');
        
        return response()->json($worshipReport);
    }

    public function destroy(WorshipReport $worshipReport): JsonResponse
    {
        $worshipReport->delete();

        return response()->json([
            'message' => 'Rapport supprimé avec succès'
        ]);
    }

    public function globalStatistics(Request $request): JsonResponse
    {
        $query = WorshipReport::query();

        if ($request->has('date_debut') && $request->has('date_fin')) {
            $query->whereBetween('date', [$request->date_debut, $request->date_fin]);
        }

        $reports = $query->get();

        $stats = [
            'total_cultes' => $reports->count(),
            'total_effectif' => $reports->sum('effectif_total'),
            'total_freres' => $reports->sum('effectif_freres'),
            'total_soeurs' => $reports->sum('effectif_soeurs'),
            'total_nouveaux_venus' => $reports->sum('nombre_nouveaux_venus'),
            'moyenne_effectif' => $reports->avg('effectif_total'),
        ];

        return response()->json($stats);
    }
}
