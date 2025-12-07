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

        $reports = $query->orderBy('date', 'asc')->get();
        $totalCultes = $reports->count();

        // Calcul des totaux
        $totalEffectif = $reports->sum('effectif_total');
        $totalFreres = $reports->sum('effectif_freres');
        $totalSoeurs = $reports->sum('effectif_soeurs');
        $totalNouveauxVenus = $reports->sum('nombre_nouveaux_venus');

        // Calcul des moyennes
        $moyenneEffectif = $totalCultes > 0 ? $totalEffectif / $totalCultes : 0;
        $moyenneFreres = $totalCultes > 0 ? $totalFreres / $totalCultes : 0;
        $moyenneSoeurs = $totalCultes > 0 ? $totalSoeurs / $totalCultes : 0;
        $moyenneNouveauxVenus = $totalCultes > 0 ? $totalNouveauxVenus / $totalCultes : 0;

        // Liste des offrandes et calcul du total
        $offrandes = $reports->pluck('offrandes')->filter()->values()->toArray();
        
        // Calculer le total des offrandes (somme des montants en FC et GN)
        $totalFC = 0;
        $totalGN = 0;
        
        foreach ($offrandes as $offrande) {
            // Parse les offrandes au format "123,456 FC + 2 GN" ou "123,456 FC"
            if (preg_match('/([0-9,]+)\s*FC/', $offrande, $matchesFC)) {
                $totalFC += (float) str_replace(',', '', $matchesFC[1]);
            }
            if (preg_match('/(\d+)\s*GN/', $offrande, $matchesGN)) {
                $totalGN += (int) $matchesGN[1];
            }
        }
        
        $totalOffrandes = number_format($totalFC, 0, ',', ',') . ' FC';
        if ($totalGN > 0) {
            $totalOffrandes .= ' + ' . $totalGN . ' GN';
        }

        // Rapports par salle
        $rapportsParSalle = $reports->groupBy('salle')->map(function ($group) {
            return $group->count();
        })->toArray();

        $stats = [
            'totalEffectif' => $totalEffectif,
            'totalFreres' => $totalFreres,
            'totalSoeurs' => $totalSoeurs,
            'totalNouveauxVenus' => $totalNouveauxVenus,
            'moyenneEffectif' => round($moyenneEffectif, 2),
            'moyenneFreres' => round($moyenneFreres, 2),
            'moyenneSoeurs' => round($moyenneSoeurs, 2),
            'moyenneNouveauxVenus' => round($moyenneNouveauxVenus, 2),
            'offrandes' => $offrandes,
            'totalOffrandes' => $totalOffrandes,
            'rapportsParSalle' => $rapportsParSalle,
            'totalCultes' => $totalCultes,
        ];

        return response()->json($stats);
    }

    /** @OA\Get(path="/worship-reports-room-statistics", tags={"Worship Reports"}, summary="Statistiques par salle", @OA\Parameter(name="salle", in="query", required=true, @OA\Schema(type="string")), @OA\Parameter(name="date_debut", in="query", required=false, @OA\Schema(type="string", format="date")), @OA\Parameter(name="date_fin", in="query", required=false, @OA\Schema(type="string", format="date")), @OA\Response(response=200, description="Statistiques pour une salle spécifique")) */
    public function roomStatistics(Request $request): JsonResponse
    {
        $request->validate([
            'salle' => 'required|string',
        ]);

        $query = WorshipReport::where('salle', $request->salle);

        if ($request->has('date_debut') && $request->has('date_fin')) {
            $query->whereBetween('date', [$request->date_debut, $request->date_fin]);
        }

        $reports = $query->orderBy('date', 'asc')->get();
        $nombreCultes = $reports->count();

        if ($nombreCultes === 0) {
            return response()->json([
                'salle' => $request->salle,
                'nombreCultes' => 0,
                'totalEffectif' => 0,
                'totalFreres' => 0,
                'totalSoeurs' => 0,
                'totalNouveauxVenus' => 0,
                'moyenneEffectif' => 0,
                'moyenneFreres' => 0,
                'moyenneSoeurs' => 0,
                'moyenneNouveauxVenus' => 0,
                'offrandes' => [],
                'totalOffrandes' => '0 FC',
                'meilleurePresence' => null,
                'moinsPresence' => null,
            ]);
        }

        // Calcul des totaux
        $totalEffectif = $reports->sum('effectif_total');
        $totalFreres = $reports->sum('effectif_freres');
        $totalSoeurs = $reports->sum('effectif_soeurs');
        $totalNouveauxVenus = $reports->sum('nombre_nouveaux_venus');

        // Calcul des moyennes
        $moyenneEffectif = $totalEffectif / $nombreCultes;
        $moyenneFreres = $totalFreres / $nombreCultes;
        $moyenneSoeurs = $totalSoeurs / $nombreCultes;
        $moyenneNouveauxVenus = $totalNouveauxVenus / $nombreCultes;

        // Liste des offrandes et calcul du total
        $offrandes = $reports->pluck('offrandes')->filter()->values()->toArray();
        
        // Calculer le total des offrandes
        $totalFC = 0;
        $totalGN = 0;
        
        foreach ($offrandes as $offrande) {
            if (preg_match('/([0-9,]+)\s*FC/', $offrande, $matchesFC)) {
                $totalFC += (float) str_replace(',', '', $matchesFC[1]);
            }
            if (preg_match('/(\d+)\s*GN/', $offrande, $matchesGN)) {
                $totalGN += (int) $matchesGN[1];
            }
        }
        
        $totalOffrandes = number_format($totalFC, 0, ',', ',') . ' FC';
        if ($totalGN > 0) {
            $totalOffrandes .= ' + ' . $totalGN . ' GN';
        }

        // Meilleure et moins bonne présence
        $meilleurePresence = $reports->sortByDesc('effectif_total')->first();
        $moinsPresence = $reports->sortBy('effectif_total')->first();

        $stats = [
            'salle' => $request->salle,
            'nombreCultes' => $nombreCultes,
            'totalEffectif' => $totalEffectif,
            'totalFreres' => $totalFreres,
            'totalSoeurs' => $totalSoeurs,
            'totalNouveauxVenus' => $totalNouveauxVenus,
            'moyenneEffectif' => round($moyenneEffectif, 2),
            'moyenneFreres' => round($moyenneFreres, 2),
            'moyenneSoeurs' => round($moyenneSoeurs, 2),
            'moyenneNouveauxVenus' => round($moyenneNouveauxVenus, 2),
            'offrandes' => $offrandes,
            'totalOffrandes' => $totalOffrandes,
            'meilleurePresence' => $meilleurePresence ? [
                'date' => $meilleurePresence->date,
                'effectif' => $meilleurePresence->effectif_total,
            ] : null,
            'moinsPresence' => $moinsPresence ? [
                'date' => $moinsPresence->date,
                'effectif' => $moinsPresence->effectif_total,
            ] : null,
        ];

        return response()->json($stats);
    }
}
