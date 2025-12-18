<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSalleRequest;
use App\Http\Requests\UpdateSalleRequest;
use App\Models\Salle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SalleController extends Controller
{
    /**
     * @OA\Get(
     *     path="/salles",
     *     tags={"Salles"},
     *     summary="Liste toutes les salles",
     *     description="Retourne la liste paginée des salles avec leurs responsables",
     *     @OA\Parameter(
     *         name="actif",
     *         in="query",
     *         description="Filtrer par statut actif",
     *         required=false,
     *         @OA\Schema(type="boolean")
     *     ),
     *     @OA\Parameter(
     *         name="per_page",
     *         in="query",
     *         description="Nombre d'éléments par page",
     *         required=false,
     *         @OA\Schema(type="integer", default=15)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Liste des salles récupérée avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="current_page", type="integer"),
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Salle")),
     *             @OA\Property(property="total", type="integer")
     *         )
     *     )
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = Salle::with(['responsable', 'adjoint', 'moniteurs']);

        if ($request->has('actif')) {
            $query->where('actif', $request->boolean('actif'));
        }

        $perPage = $request->get('per_page', 15);
        $salles = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json($salles);
    }

    /**
     * @OA\Post(
     *     path="/salles",
     *     tags={"Salles"},
     *     summary="Créer une nouvelle salle",
     *     description="Crée une nouvelle salle avec les données fournies",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/StoreSalleRequest")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Salle créée avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Salle créée avec succès"),
     *             @OA\Property(property="data", ref="#/components/schemas/Salle")
     *         )
     *     ),
     *     @OA\Response(response=422, description="Erreur de validation")
     * )
     */
    public function store(StoreSalleRequest $request): JsonResponse
    {
        $data = $request->validated();
        
        $moniteursIds = $data['moniteurs_ids'] ?? [];
        unset($data['moniteurs_ids']);

        $salle = Salle::create($data);

        // Association des moniteurs (Mise à jour table moniteurs + Pivot)
        if (!empty($moniteursIds)) {
            // 1. Mettre à jour la table 'monitors' (Direct)
            \App\Models\Monitor::whereIn('id', $moniteursIds)->update([
                'salle_actuelle_id' => $salle->id,
                'salle_actuelle_nom' => $salle->nom,
                'date_affectation_actuelle' => now(),
            ]);

            // 2. Attacher dans la table pivot 'moniteur_salle' (Insertion manuelle car colonnes supplémentaires requises)
            $moniteurs = \App\Models\Monitor::whereIn('id', $moniteursIds)->get();
            $pivotInsertData = [];

            foreach ($moniteurs as $moniteur) {
                // Déterminer le rôle
                $role = 'membre'; // 'moniteur' n'est pas dans l'enum de la migration ('responsable', 'adjoint', 'membre')
                if ($moniteur->id === $salle->responsable_id) $role = 'responsable';
                elseif ($moniteur->id === $salle->adjoint_id) $role = 'adjoint';

                $pivotInsertData[] = [
                    'id' => \Illuminate\Support\Str::uuid()->toString(),
                    'moniteur_id' => $moniteur->id,
                    'moniteur_nom' => $moniteur->nom,
                    'moniteur_prenom' => $moniteur->prenom,
                    'moniteur_nom_complet' => $moniteur->nom_complet, // Assumant que l'attribut existe/est append
                    'salle_id' => $salle->id,
                    'role' => $role,
                    'date_affectation' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            if (!empty($pivotInsertData)) {
                \Illuminate\Support\Facades\DB::table('moniteur_salle')->insert($pivotInsertData);
            }
        }

        // Si Responsable/Adjoint ne sont pas dans la liste moniteurs_ids, il faut aussi les lier ?
        // Normalement le frontend inclut tout le monde, mais par sécurité on pourrait vérifier.
        // Pour l'instant on fait confiance au frontend qui envoie la sélection.

        return response()->json([
            'message' => 'Salle créée avec succès',
            'data' => $salle
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/salles/{id}",
     *     tags={"Salles"},
     *     summary="Détails d'une salle",
     *     description="Retourne les détails d'une salle avec ses relations",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID de la salle",
     *         required=true,
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Détails de la salle",
     *         @OA\JsonContent(ref="#/components/schemas/Salle")
     *     ),
     *     @OA\Response(response=404, description="Salle non trouvée")
     * )
     */
    public function show(Salle $salle): JsonResponse
    {
        $salle->load(['responsable', 'adjoint', 'moniteurs', 'historique']);
        
        // Transformer la collection de moniteurs pour aplatir les données du pivot
        $salle->moniteurs->transform(function ($moniteur) {
            $moniteurData = $moniteur->toArray();
            if ($moniteur->pivot) {
                $moniteurData['role'] = $moniteur->pivot->role;
                $moniteurData['dateAffectation'] = $moniteur->pivot->date_affectation;
                // On s'assure que nomComplet est là (déjà fait par le modèle Monitor)
            }
            return $moniteurData;
        });

        return response()->json($salle);
    }

    /**
     * @OA\Put(
     *     path="/salles/{id}",
     *     tags={"Salles"},
     *     summary="Modifier une salle",
     *     description="Met à jour les informations d'une salle",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID de la salle",
     *         required=true,
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/UpdateSalleRequest")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Salle mise à jour avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", ref="#/components/schemas/Salle")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Salle non trouvée"),
     *     @OA\Response(response=422, description="Erreur de validation")
     * )
     */
    public function update(UpdateSalleRequest $request, Salle $salle): JsonResponse
    {
        $data = $request->validated();
        
        $moniteursIds = $data['moniteurs_ids'] ?? [];
        unset($data['moniteurs_ids']); // On ne veut pas l'update directement sur le modèle Salle

        $salle->update($data);

        // Gestion des moniteurs lors de la mise à jour
        if ($request->has('moniteurs_ids')) {
            // 1. Gérer les détachements (Moniteurs qui ne sont plus dans la liste)
            // On trouve les moniteurs qui étaient dans cette salle mais qui ne sont plus dans la nouvelle liste
            \App\Models\Monitor::where('salle_actuelle_id', $salle->id)
                ->whereNotIn('id', $moniteursIds)
                ->update([
                    'salle_actuelle_id' => null,
                    'salle_actuelle_nom' => null,
                    'date_affectation_actuelle' => null,
                ]);

            // 2. Gérer les attachements (Nouveaux et existants confirmés)
            if (!empty($moniteursIds)) {
                \App\Models\Monitor::whereIn('id', $moniteursIds)->update([
                    'salle_actuelle_id' => $salle->id,
                    'salle_actuelle_nom' => $salle->nom,
                    'date_affectation_actuelle' => now(), // Ou conserver l'ancienne si déjà présent ? Pour simplifier, on update.
                ]);
            }

            // 3. Mettre à jour la table pivot 'moniteur_salle'
            // Le plus simple et sûr pour garantir la cohérence : Supprimer tout pour cette salle et recréer
            \Illuminate\Support\Facades\DB::table('moniteur_salle')->where('salle_id', $salle->id)->delete();

            if (!empty($moniteursIds)) {
                $moniteurs = \App\Models\Monitor::whereIn('id', $moniteursIds)->get();
                $pivotInsertData = [];

                foreach ($moniteurs as $moniteur) {
                    $role = 'membre';
                    if ($moniteur->id === $salle->responsable_id) $role = 'responsable';
                    elseif ($moniteur->id === $salle->adjoint_id) $role = 'adjoint';

                    $pivotInsertData[] = [
                        'id' => \Illuminate\Support\Str::uuid()->toString(),
                        'moniteur_id' => $moniteur->id,
                        'moniteur_nom' => $moniteur->nom,
                        'moniteur_prenom' => $moniteur->prenom,
                        'moniteur_nom_complet' => $moniteur->nom_complet,
                        'salle_id' => $salle->id,
                        'role' => $role,
                        'date_affectation' => now(),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                if (!empty($pivotInsertData)) {
                    \Illuminate\Support\Facades\DB::table('moniteur_salle')->insert($pivotInsertData);
                }
            }
        }

        return response()->json([
            'message' => 'Salle mise à jour avec succès',
            'data' => $salle
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/salles/{id}",
     *     tags={"Salles"},
     *     summary="Supprimer une salle",
     *     description="Supprime (soft delete) une salle",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID de la salle",
     *         required=true,
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Salle supprimée avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Salle supprimée avec succès")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Salle non trouvée")
     * )
     */
    public function destroy(Salle $salle): JsonResponse
    {
        $salle->delete();

        return response()->json([
            'message' => 'Salle supprimée avec succès'
        ]);
    }
}
