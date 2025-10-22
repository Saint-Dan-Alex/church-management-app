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
    /** @OA\Get(path="/worship-reports", tags={"Worship Reports"}, summary="Liste tous les rapports de culte", @OA\Parameter(name="salle", in="query", required=false, @OA\Schema(type="string")), @OA\Parameter(name="date_debut", in="query", required=false, @OA\Schema(type="string", format="date")), @OA\Parameter(name="date_fin", in="query", required=false, @OA\Schema(type="string", format="date")), @OA\Parameter(name="per_page", in="query", required=false, @OA\Schema(type="integer", default=15)), @OA\Response(response=200, description="Liste récupérée")) */
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

    /** @OA\Post(path="/worship-reports", tags={"Worship Reports"}, summary="Créer un rapport de culte", @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/StoreWorshipReportRequest")), @OA\Response(response=201, description="Rapport créé avec nouveaux venus"), @OA\Response(response=422, description="Erreur de validation"), @OA\Response(response=500, description="Erreur serveur")) */
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

    /** @OA\Get(path="/worship-reports/{id}", tags={"Worship Reports"}, summary="Détails d'un rapport de culte", @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")), @OA\Response(response=200, description="Détails avec nouveaux venus"), @OA\Response(response=404, description="Non trouvé")) */
    public function show(WorshipReport $worshipReport): JsonResponse
    {
        $worshipReport->load('nouveauxVenus');
        
        return response()->json($worshipReport);
    }

    /** @OA\Delete(path="/worship-reports/{id}", tags={"Worship Reports"}, summary="Supprimer un rapport de culte", @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")), @OA\Response(response=200, description="Supprimé"), @OA\Response(response=404, description="Non trouvé")) */
    public function destroy(WorshipReport $worshipReport): JsonResponse
    {
        $worshipReport->delete();

        return response()->json([
            'message' => 'Rapport supprimé avec succès'
        ]);
    }

    /** @OA\Get(path="/worship-reports-global-statistics", tags={"Worship Reports"}, summary="Statistiques globales des cultes", @OA\Parameter(name="date_debut", in="query", required=false, @OA\Schema(type="string", format="date")), @OA\Parameter(name="date_fin", in="query", required=false, @OA\Schema(type="string", format="date")), @OA\Response(response=200, description="Statistiques", @OA\JsonContent(@OA\Property(property="total_cultes", type="integer"), @OA\Property(property="total_effectif", type="integer"), @OA\Property(property="total_nouveaux_venus", type="integer")))) */
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
