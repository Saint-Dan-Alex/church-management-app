<?php

use App\Models\Presence;
use App\Models\Activity;
use App\Models\Monitor;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Auth;

require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    echo "Testing Presence Creation...\n";
    
    // 1. Mock Data
    $activity = Activity::first();
    if (!$activity) die("No activity found.\n");
    
    $monitor = Monitor::first();
    if (!$monitor) die("No monitor found.\n");

    echo "Activity: " . $activity->id . "\n";
    echo "Monitor: " . $monitor->id . "\n";

    $data = [
        'activity_id' => $activity->id,
        'activity_nom' => $activity->title,
        'moniteur_id' => $monitor->id,
        'moniteur_nom' => $monitor->nom ?? 'Test',
        'moniteur_prenom' => $monitor->prenom ?? 'Monitor',
        'moniteur_nom_complet' => 'Test Monitor',
        'date_presence' => date('Y-m-d'),
        'heure_arrivee' => '08:00',
        'statut' => 'present',
        'mode_enregistrement' => 'manuel',
        'participant_id' => $monitor->id,
        'participant_type' => \App\Models\Monitor::class
    ];

    echo "Creating presence...\n";
    $presence = Presence::create($data);
    echo "Presence created: " . $presence->id . "\n";
    
    echo "Testing Notification...\n";
    
    // Mock Auth
    // Auth::loginUsingId(1);
    
    NotificationService::notifyPresence(
        1, // User ID hardcoded
        [
            'id' => $presence->id,
            'moniteur_nom' => $presence->moniteur_nom, 
            'participant_nom' => 'Test Participant',
            'activity_nom' => $presence->activity_nom,
            'activity_id' => $presence->activity_id,
            'statut' => $presence->statut,
        ]
    );
    echo "Notification sent.\n";
    
    // Cleanup
    // $presence->delete();
    
} catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}
