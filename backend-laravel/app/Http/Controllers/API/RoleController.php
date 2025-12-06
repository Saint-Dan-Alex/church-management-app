<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * @OA\Get(
     *     path="/roles",
     *     tags={"Roles"},
     *     summary="Liste tous les rôles",
     *     description="Retourne la liste des rôles disponibles",
     *     @OA\Response(
     *         response=200,
     *         description="Liste des rôles",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="name", type="string"),
     *                 @OA\Property(property="guard_name", type="string"),
     *                 @OA\Property(property="created_at", type="string", format="date-time"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time")
     *             )
     *         )
     *     )
     * )
     */
    public function index(): JsonResponse
    {
        $roles = Role::all();
        return response()->json($roles);
    }
}
