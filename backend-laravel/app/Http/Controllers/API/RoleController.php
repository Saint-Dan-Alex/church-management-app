<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Retourner la liste des rôles (Spatie Permission)
     */
    public function index(): JsonResponse
    {
        $roles = Role::orderBy('name')->get(['id', 'name', 'guard_name']);

        return response()->json($roles);
    }
}
