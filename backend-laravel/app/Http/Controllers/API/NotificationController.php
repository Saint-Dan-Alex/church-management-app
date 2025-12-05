<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Récupérer toutes les notifications de l'utilisateur connecté
     */
    public function index(Request $request)
    {
        $query = Notification::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc');

        // Filtrer par statut (lu/non lu)
        if ($request->has('unread_only') && $request->unread_only) {
            $query->whereNull('read_at');
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $notifications = $query->paginate($perPage);

        return response()->json($notifications);
    }

    /**
     * Récupérer le nombre de notifications non lues
     */
    public function unreadCount()
    {
        $count = Notification::where('user_id', Auth::id())
            ->whereNull('read_at')
            ->count();

        return response()->json(['count' => $count]);
    }

    /**
     * Marquer une notification comme lue
     */
    public function markAsRead($id)
    {
        $notification = Notification::where('user_id', Auth::id())
            ->findOrFail($id);

        $notification->update(['read_at' => now()]);

        return response()->json([
            'message' => 'Notification marquée comme lue',
            'data' => $notification
        ]);
    }

    /**
     * Marquer toutes les notifications comme lues
     */
    public function markAllAsRead()
    {
        $updated = Notification::where('user_id', Auth::id())
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json([
            'message' => 'Toutes les notifications ont été marquées comme lues',
            'count' => $updated
        ]);
    }

    /**
     * Supprimer une notification
     */
    public function destroy($id)
    {
        $notification = Notification::where('user_id', Auth::id())
            ->findOrFail($id);

        $notification->delete();

        return response()->json([
            'message' => 'Notification supprimée avec succès'
        ]);
    }

    /**
     * Supprimer toutes les notifications lues
     */
    public function deleteAllRead()
    {
        $deleted = Notification::where('user_id', Auth::id())
            ->whereNotNull('read_at')
            ->delete();

        return response()->json([
            'message' => 'Toutes les notifications lues ont été supprimées',
            'count' => $deleted
        ]);
    }

    /**
     * Créer une nouvelle notification (pour tests ou usage interne)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'type' => 'required|string|max:50',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'data' => 'nullable|array',
            'action_url' => 'nullable|string|max:255',
        ]);

        $notification = Notification::create($validated);

        return response()->json([
            'message' => 'Notification créée avec succès',
            'data' => $notification
        ], 201);
    }
}
