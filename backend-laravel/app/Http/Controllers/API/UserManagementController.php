<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserManagementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->prenom . ' ' . $user->nom,
                'email' => $user->email,
                'phone' => $user->telephone,
                'role' => $user->role,
                'avatar' => $user->avatar,
                'active' => (bool) $user->actif,
                'dateCreation' => $user->created_at,
            ];
        });

        return response()->json($users);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string',
        ]);

        // Simple split for name if needed, or adjust frontend to send nom/prenom
        $parts = explode(' ', $validated['name'], 2);
        $prenom = $parts[0];
        $nom = $parts[1] ?? '';

        $user = User::create([
            'prenom' => $prenom,
            'nom' => $nom,
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => $validated['role'],
            'actif' => true,
        ]);

        return response()->json($user, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::findOrFail($id);
        return response()->json([
            'id' => $user->id,
            'name' => $user->prenom . ' ' . $user->nom,
            'email' => $user->email,
            'phone' => $user->telephone,
            'role' => $user->role,
            'avatar' => $user->avatar,
            'active' => (bool) $user->actif,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);
        
        // Handle 'active' mapping
        if ($request->has('active')) {
            $user->actif = $request->input('active');
        }
        
        // Handle name mapping if provided
        if ($request->has('name')) {
            $parts = explode(' ', $request->input('name'), 2);
            $user->prenom = $parts[0];
            $user->nom = $parts[1] ?? $user->nom;
        }

        $user->fill($request->except(['id', 'name', 'active']));
        $user->save();

        return response()->json($user);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        User::destroy($id);
        return response()->json(null, 204);
    }
}
