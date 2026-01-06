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

        // Association des moniteurs
        if (!empty($moniteursIds)) {
            $this->assignMonitorsToSalle($salle, $moniteursIds);
        }

        return response()->json([
            'message' => 'Salle créée avec succès',
            'data' => $salle
        ], 201);
    }

    public function show(Salle $salle): JsonResponse
    {
        $salle->load(['responsable', 'adjoint', 'moniteurs', 'historique']);
        
        // Transformer la collection de moniteurs pour aplatir les données du pivot
        $salle->moniteurs->transform(function ($moniteur) {
            $moniteurData = $moniteur->toArray();
            if ($moniteur->pivot) {
                $moniteurData['role'] = $moniteur->pivot->role;
                $moniteurData['dateAffectation'] = $moniteur->pivot->date_affectation;
            }
            return $moniteurData;
        });

        return response()->json($salle);
    }

    public function update(UpdateSalleRequest $request, Salle $salle): JsonResponse
    {
        $data = $request->validated();
        
        $moniteursIds = $data['moniteurs_ids'] ?? [];
        unset($data['moniteurs_ids']);

        $salle->update($data);

        // Gestion des moniteurs lors de la mise à jour
        if ($request->has('moniteurs_ids')) {
            // 1. Détacher les moniteurs qui ne sont plus dans la liste (ceux qui quittent la salle)
            // On unset leur salle actuelle
            \App\Models\Monitor::where('salle_actuelle_id', $salle->id)
                ->whereNotIn('id', $moniteursIds)
                ->update([
                    'salle_actuelle_id' => null,
                    'salle_actuelle_nom' => null,
                    'date_affectation_actuelle' => null,
                ]);

            // Pour ceux qui quittent, on devrait peut-être aussi remettre leur rôle à 'moniteur' ?
            // Pour l'instant on laisse leur rôle tel quel, ou on pourrait le forcer à 'membre'/'moniteur' par défaut.
            
            // 2. Nettoyer la table pivot pour CETTE salle (on va recréer les liens proprement)
            \Illuminate\Support\Facades\DB::table('moniteur_salle')->where('salle_id', $salle->id)->delete();

            // 3. Réassigner les nouveaux (et ceux qui restent)
            if (!empty($moniteursIds)) {
                $this->assignMonitorsToSalle($salle, $moniteursIds);
            }
        }

        return response()->json([
            'message' => 'Salle mise à jour avec succès',
            'data' => $salle
        ]);
    }

    public function destroy(Salle $salle): JsonResponse
    {
        // Avant de supprimer, on libère les moniteurs
        \App\Models\Monitor::where('salle_actuelle_id', $salle->id)->update([
            'salle_actuelle_id' => null,
            'salle_actuelle_nom' => null,
            'date_affectation_actuelle' => null,
        ]);
        
        $salle->delete();

        return response()->json([
            'message' => 'Salle supprimée avec succès'
        ]);
    }

    /**
     * Helper pour assigner les moniteurs à une salle et mettre à jour leurs rôles
     */
    private function assignMonitorsToSalle(Salle $salle, array $moniteursIds)
    {
        // 0. Fermer les anciennes entrées d'historique pour ces moniteurs
        \App\Models\MoniteurSalleHistorique::whereIn('moniteur_id', $moniteursIds)
            ->where('actif', true)
            ->update([
                'actif' => false,
                'date_fin' => now(),
                'motif_changement' => 'Réaffectation vers ' . $salle->nom,
            ]);

        // 1. Détacher ces moniteurs de TOUTE autre salle (Pivot + Table Monitor)
        // Table pivot: on supprime toute entrée pour ces moniteurs, peu importe la salle
        \Illuminate\Support\Facades\DB::table('moniteur_salle')
            ->whereIn('moniteur_id', $moniteursIds)
            ->delete();

        // 2. Mettre à jour la table 'monitors' pour dire qu'ils sont maintenant ici
        \App\Models\Monitor::whereIn('id', $moniteursIds)->update([
            'salle_actuelle_id' => $salle->id,
            'salle_actuelle_nom' => $salle->nom,
            'date_affectation_actuelle' => now(),
        ]);

        // 3. Récupérer les objets Moniteur pour traiter les rôles
        $moniteurs = \App\Models\Monitor::whereIn('id', $moniteursIds)->get();
        $pivotInsertData = [];

        foreach ($moniteurs as $moniteur) {
            // Déterminer le rôle dans la salle
            $roleSalle = 'membre';
            $nouveauRoleSysteme = 'MONITEUR'; // Par défaut
            $nouveauRoleMonitor = 'membre'; // Par défaut

            if ($moniteur->id === $salle->responsable_id) {
                $roleSalle = 'responsable';
                $nouveauRoleSysteme = 'CHEF_SALLE';
                $nouveauRoleMonitor = 'responsable';
            } elseif ($moniteur->id === $salle->adjoint_id) {
                $roleSalle = 'adjoint';
                $nouveauRoleSysteme = 'MONITEUR'; // ou ADJOINT si on veut créer ce rôle
                $nouveauRoleMonitor = 'adjoint';
            }

            // Préparer données pivot
            $pivotInsertData[] = [
                'id' => \Illuminate\Support\Str::uuid()->toString(),
                'moniteur_id' => $moniteur->id,
                'moniteur_nom' => $moniteur->nom,
                'moniteur_prenom' => $moniteur->prenom,
                'moniteur_nom_complet' => $moniteur->nom_complet,
                'salle_id' => $salle->id,
                'role' => $roleSalle,
                'date_affectation' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // 4. Mettre à jour le rôle individuel du moniteur et son User
            $moniteur->update(['role_actuel' => $nouveauRoleMonitor]);
            
            // Sync User Role
            $this->syncUserRole($moniteur->email, $nouveauRoleSysteme);

            // 5. Créer une entrée dans l'historique des affectations
            \App\Models\MoniteurSalleHistorique::create([
                'moniteur_id' => $moniteur->id,
                'moniteur_nom' => $moniteur->nom,
                'moniteur_prenom' => $moniteur->prenom,
                'moniteur_nom_complet' => $moniteur->nom_complet,
                'salle_id' => $salle->id,
                'salle_nom' => $salle->nom,
                'role' => $roleSalle,
                'date_debut' => now(),
                'date_fin' => null,
                'actif' => true,
                'motif_changement' => 'Affectation initiale',
            ]);
        }

        // Insertion en masse dans le pivot
        if (!empty($pivotInsertData)) {
            \Illuminate\Support\Facades\DB::table('moniteur_salle')->insert($pivotInsertData);
        }
    }

    /**
     * Met à jour le rôle système (User) basé sur le nouveau statut
     */
    private function syncUserRole(string $email, string $roleSysteme)
    {
        $user = \App\Models\User::where('email', $email)->first();
        if ($user) {
            // Mettre à jour le type
            $user->update(['user_type' => $roleSysteme]);
            
            // Mettre à jour les permissions via Spatie
            // Attention: syncRoles attend le nom du rôle tel que défini dans PermissionsSeeder
            // On assume que 'CHEF_SALLE' et 'MONITEUR' existent.
            $user->syncRoles([$roleSysteme]);
        }
    }
}
