# 🎮 TOUS LES CONTROLLERS - Code complet

## MonitorController.php

```php
<?php

namespace App\Http\Controllers;

use App\Models\Monitor;
use Illuminate\Http\Request;

class MonitorController extends Controller
{
    /**
     * Display a listing of monitors.
     */
    public function index(Request $request)
    {
        $query = Monitor::with('user');

        // Filtres
        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        if ($request->has('specialite')) {
            $query->where('specialite', $request->specialite);
        }

        // Recherche
        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('user', function($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('prenom', 'like', "%{$search}%");
            });
        }

        $monitors = $query->paginate(15);

        return response()->json($monitors);
    }

    /**
     * Store a newly created monitor.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'specialite' => 'nullable|string|max:255',
            'date_integration' => 'required|date',
            'statut' => 'required|in:actif,inactif,conge',
            'competences' => 'nullable|string',
            'formations' => 'nullable|string',
            'annees_experience' => 'nullable|integer|min:0',
            'photo' => 'nullable|string',
        ]);

        $monitor = Monitor::create($validated);
        $monitor->load('user');

        return response()->json([
            'message' => 'Moniteur créé avec succès',
            'data' => $monitor
        ], 201);
    }

    /**
     * Display the specified monitor.
     */
    public function show($id)
    {
        $monitor = Monitor::with(['user', 'children', 'activities'])->findOrFail($id);
        
        return response()->json($monitor);
    }

    /**
     * Update the specified monitor.
     */
    public function update(Request $request, $id)
    {
        $monitor = Monitor::findOrFail($id);

        $validated = $request->validate([
            'specialite' => 'nullable|string|max:255',
            'date_integration' => 'sometimes|date',
            'statut' => 'sometimes|in:actif,inactif,conge',
            'competences' => 'nullable|string',
            'formations' => 'nullable|string',
            'annees_experience' => 'nullable|integer|min:0',
            'photo' => 'nullable|string',
        ]);

        $monitor->update($validated);
        $monitor->load('user');

        return response()->json([
            'message' => 'Moniteur mis à jour avec succès',
            'data' => $monitor
        ]);
    }

    /**
     * Remove the specified monitor.
     */
    public function destroy($id)
    {
        $monitor = Monitor::findOrFail($id);
        $monitor->delete();

        return response()->json([
            'message' => 'Moniteur supprimé avec succès'
        ]);
    }
}
```

## ChildController.php

```php
<?php

namespace App\Http\Controllers;

use App\Models\Child;
use Illuminate\Http\Request;

class ChildController extends Controller
{
    public function index(Request $request)
    {
        $query = Child::with(['monitor', 'room']);

        // Filtres
        if ($request->has('monitor_id')) {
            $query->where('monitor_id', $request->monitor_id);
        }

        if ($request->has('room_id')) {
            $query->where('room_id', $request->room_id);
        }

        if ($request->has('genre')) {
            $query->where('genre', $request->genre);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        // Recherche
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('prenom', 'like', "%{$search}%");
            });
        }

        $children = $query->paginate(20);

        return response()->json($children);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'date_naissance' => 'required|date',
            'genre' => 'required|in:garcon,fille',
            'classe_scolaire' => 'nullable|string|max:255',
            'allergies' => 'nullable|string',
            'besoins_speciaux' => 'nullable|string',
            'photo' => 'nullable|string',
            'nom_pere' => 'nullable|string|max:255',
            'telephone_pere' => 'nullable|string|max:20',
            'nom_mere' => 'nullable|string|max:255',
            'telephone_mere' => 'nullable|string|max:20',
            'contact_urgence' => 'nullable|string|max:255',
            'telephone_urgence' => 'nullable|string|max:20',
            'monitor_id' => 'nullable|exists:monitors,id',
            'room_id' => 'nullable|exists:rooms,id',
        ]);

        $child = Child::create($validated);
        $child->load(['monitor', 'room']);

        return response()->json([
            'message' => 'Enfant créé avec succès',
            'data' => $child
        ], 201);
    }

    public function show($id)
    {
        $child = Child::with([
            'monitor.user',
            'room',
            'worshipAttendances.worshipSession',
            'activityParticipations.activity'
        ])->findOrFail($id);
        
        return response()->json($child);
    }

    public function update(Request $request, $id)
    {
        $child = Child::findOrFail($id);

        $validated = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'date_naissance' => 'sometimes|date',
            'genre' => 'sometimes|in:garcon,fille',
            'classe_scolaire' => 'nullable|string|max:255',
            'allergies' => 'nullable|string',
            'besoins_speciaux' => 'nullable|string',
            'photo' => 'nullable|string',
            'nom_pere' => 'nullable|string|max:255',
            'telephone_pere' => 'nullable|string|max:20',
            'nom_mere' => 'nullable|string|max:255',
            'telephone_mere' => 'nullable|string|max:20',
            'contact_urgence' => 'nullable|string|max:255',
            'telephone_urgence' => 'nullable|string|max:20',
            'monitor_id' => 'nullable|exists:monitors,id',
            'room_id' => 'nullable|exists:rooms,id',
            'is_active' => 'sometimes|boolean',
        ]);

        $child->update($validated);
        $child->load(['monitor', 'room']);

        return response()->json([
            'message' => 'Enfant mis à jour avec succès',
            'data' => $child
        ]);
    }

    public function destroy($id)
    {
        $child = Child::findOrFail($id);
        $child->delete();

        return response()->json([
            'message' => 'Enfant supprimé avec succès'
        ]);
    }
}
```

## WorshipController.php

```php
<?php

namespace App\Http\Controllers;

use App\Models\WorshipSession;
use App\Models\WorshipAttendance;
use Illuminate\Http\Request;

class WorshipController extends Controller
{
    public function index(Request $request)
    {
        $query = WorshipSession::with(['room', 'predicateur.user']);

        // Filtres
        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        if ($request->has('date_debut') && $request->has('date_fin')) {
            $query->whereBetween('date', [$request->date_debut, $request->date_fin]);
        }

        $sessions = $query->orderBy('date', 'desc')->paginate(15);

        return response()->json($sessions);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'date' => 'required|date',
            'heure_debut' => 'required',
            'heure_fin' => 'required',
            'room_id' => 'required|exists:rooms,id',
            'predicateur_id' => 'nullable|exists:monitors,id',
            'theme' => 'nullable|string',
            'verset_cle' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $session = WorshipSession::create($validated);
        $session->load(['room', 'predicateur']);

        return response()->json([
            'message' => 'Culte créé avec succès',
            'data' => $session
        ], 201);
    }

    public function show($id)
    {
        $session = WorshipSession::with([
            'room',
            'predicateur.user',
            'attendances.child'
        ])->findOrFail($id);
        
        return response()->json($session);
    }

    public function update(Request $request, $id)
    {
        $session = WorshipSession::findOrFail($id);

        $validated = $request->validate([
            'titre' => 'sometimes|string|max:255',
            'date' => 'sometimes|date',
            'heure_debut' => 'sometimes',
            'heure_fin' => 'sometimes',
            'room_id' => 'sometimes|exists:rooms,id',
            'predicateur_id' => 'nullable|exists:monitors,id',
            'theme' => 'nullable|string',
            'verset_cle' => 'nullable|string',
            'notes' => 'nullable|string',
            'statut' => 'sometimes|in:planifie,en_cours,termine,annule',
        ]);

        $session->update($validated);
        $session->load(['room', 'predicateur']);

        return response()->json([
            'message' => 'Culte mis à jour avec succès',
            'data' => $session
        ]);
    }

    public function destroy($id)
    {
        $session = WorshipSession::findOrFail($id);
        $session->delete();

        return response()->json([
            'message' => 'Culte supprimé avec succès'
        ]);
    }

    /**
     * Get attendances for a worship session
     */
    public function attendances($id)
    {
        $session = WorshipSession::with('attendances.child')->findOrFail($id);
        
        return response()->json($session->attendances);
    }

    /**
     * Mark attendance for children
     */
    public function markAttendance(Request $request, $id)
    {
        $validated = $request->validate([
            'attendances' => 'required|array',
            'attendances.*.child_id' => 'required|exists:children,id',
            'attendances.*.present' => 'required|boolean',
            'attendances.*.remarque' => 'nullable|string',
        ]);

        $session = WorshipSession::findOrFail($id);

        foreach ($validated['attendances'] as $attendance) {
            WorshipAttendance::updateOrCreate(
                [
                    'worship_session_id' => $session->id,
                    'child_id' => $attendance['child_id'],
                ],
                [
                    'present' => $attendance['present'],
                    'remarque' => $attendance['remarque'] ?? null,
                ]
            );
        }

        // Update counters
        $session->nombre_presents = $session->attendances()->where('present', true)->count();
        $session->nombre_absents = $session->attendances()->where('present', false)->count();
        $session->save();

        return response()->json([
            'message' => 'Présences enregistrées avec succès',
            'data' => $session->fresh(['attendances.child'])
        ]);
    }
}
```

## RoomController.php

```php
<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        $query = Room::with('responsable.user');

        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        $rooms = $query->paginate(15);

        return response()->json($rooms);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'code' => 'required|string|unique:rooms,code',
            'capacite' => 'required|integer|min:1',
            'localisation' => 'required|string|max:255',
            'description' => 'nullable|string',
            'equipements' => 'nullable|string',
            'statut' => 'required|in:disponible,occupee,maintenance',
            'responsable_id' => 'nullable|exists:monitors,id',
            'photo' => 'nullable|string',
        ]);

        $room = Room::create($validated);
        $room->load('responsable');

        return response()->json([
            'message' => 'Salle créée avec succès',
            'data' => $room
        ], 201);
    }

    public function show($id)
    {
        $room = Room::with(['responsable.user', 'children'])->findOrFail($id);
        
        return response()->json($room);
    }

    public function update(Request $request, $id)
    {
        $room = Room::findOrFail($id);

        $validated = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'code' => 'sometimes|string|unique:rooms,code,' . $id,
            'capacite' => 'sometimes|integer|min:1',
            'localisation' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'equipements' => 'nullable|string',
            'statut' => 'sometimes|in:disponible,occupee,maintenance',
            'responsable_id' => 'nullable|exists:monitors,id',
            'photo' => 'nullable|string',
        ]);

        $room->update($validated);
        $room->load('responsable');

        return response()->json([
            'message' => 'Salle mise à jour avec succès',
            'data' => $room
        ]);
    }

    public function destroy($id)
    {
        $room = Room::findOrFail($id);
        $room->delete();

        return response()->json([
            'message' => 'Salle supprimée avec succès'
        ]);
    }
}
```

## ActivityController.php

```php
<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\ActivityParticipant;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        $query = Activity::with(['room', 'responsable.user']);

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        $activities = $query->orderBy('date_debut', 'desc')->paginate(15);

        return response()->json($activities);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:sortie,formation,jeux,spectacle,autre',
            'date_debut' => 'required|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'heure_debut' => 'required',
            'heure_fin' => 'nullable',
            'room_id' => 'nullable|exists:rooms,id',
            'lieu_externe' => 'nullable|string',
            'responsable_id' => 'required|exists:monitors,id',
            'nombre_places' => 'nullable|integer|min:1',
            'cout' => 'nullable|numeric|min:0',
            'materiel_necessaire' => 'nullable|string',
            'image' => 'nullable|string',
        ]);

        $activity = Activity::create($validated);
        $activity->load(['room', 'responsable']);

        return response()->json([
            'message' => 'Activité créée avec succès',
            'data' => $activity
        ], 201);
    }

    public function show($id)
    {
        $activity = Activity::with([
            'room',
            'responsable.user',
            'participants.child'
        ])->findOrFail($id);
        
        return response()->json($activity);
    }

    public function update(Request $request, $id)
    {
        $activity = Activity::findOrFail($id);

        $validated = $request->validate([
            'titre' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'type' => 'sometimes|in:sortie,formation,jeux,spectacle,autre',
            'date_debut' => 'sometimes|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'heure_debut' => 'sometimes',
            'heure_fin' => 'nullable',
            'room_id' => 'nullable|exists:rooms,id',
            'lieu_externe' => 'nullable|string',
            'responsable_id' => 'sometimes|exists:monitors,id',
            'nombre_places' => 'nullable|integer|min:1',
            'cout' => 'nullable|numeric|min:0',
            'statut' => 'sometimes|in:planifie,en_cours,termine,annule',
            'materiel_necessaire' => 'nullable|string',
            'image' => 'nullable|string',
        ]);

        $activity->update($validated);
        $activity->load(['room', 'responsable']);

        return response()->json([
            'message' => 'Activité mise à jour avec succès',
            'data' => $activity
        ]);
    }

    public function destroy($id)
    {
        $activity = Activity::findOrFail($id);
        $activity->delete();

        return response()->json([
            'message' => 'Activité supprimée avec succès'
        ]);
    }

    public function participants($id)
    {
        $activity = Activity::with('participants.child')->findOrFail($id);
        
        return response()->json($activity->participants);
    }

    public function registerParticipant(Request $request, $id)
    {
        $validated = $request->validate([
            'child_id' => 'required|exists:children,id',
            'remarque' => 'nullable|string',
        ]);

        $activity = Activity::findOrFail($id);

        $participant = ActivityParticipant::create([
            'activity_id' => $activity->id,
            'child_id' => $validated['child_id'],
            'remarque' => $validated['remarque'] ?? null,
        ]);

        return response()->json([
            'message' => 'Participant inscrit avec succès',
            'data' => $participant->load('child')
        ], 201);
    }
}
```

---

## Instructions

1. Créer le dossier `app/Http/Controllers/` si nécessaire
2. Copier chaque controller
3. Les autres controllers (Teaching, Blog, Video, Photo, User, Dashboard, Report) suivent le même modèle CRUD
4. Adapter selon vos besoins spécifiques
