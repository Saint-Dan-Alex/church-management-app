<?php

use App\Models\Presence;
use App\Models\Activity;
use App\Models\Monitor;
use Illuminate\Http\Request;

require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    echo "Testing Presence Filtering...\n";
    
    // Create dummy presences for different dates
    $activity = Activity::first();
    $monitor = Monitor::first();
    
    if (!$activity || !$monitor) die("No data\n");
    
    $commonData = [
        'activity_id' => $activity->id,
        'activity_nom' => $activity->title,
        'moniteur_id' => $monitor->id,
        'moniteur_nom' => $monitor->nom ?? 'Test',
        'moniteur_prenom' => $monitor->prenom ?? '',
        'moniteur_nom_complet' => $monitor->nom_complet ?? 'Test',
        'participant_id' => $monitor->id,
        'participant_type' => \App\Models\Monitor::class,
        'heure_arrivee' => '09:00',
        'statut' => 'present',
        'mode_enregistrement' => 'manuel'
    ];
    
    $p1 = Presence::create(array_merge($commonData, ['date_presence' => '2025-12-23', 'id' => \Illuminate\Support\Str::uuid()]));
    $p2 = Presence::create(array_merge($commonData, ['date_presence' => '2025-12-24', 'id' => \Illuminate\Support\Str::uuid()]));
    
    echo "Created presences for 23rd and 24th.\n";
    
    // Simulate Request filtering
    // Since I cannot call controller->index directly with query params easily without mocking,
    // I will replicate the query logic to ensure it works.
    
    $requestDate = '2025-12-23';
    
    $query = Presence::query();
    $query->where('activity_id', $activity->id);
    
    if ($requestDate) {
        $query->whereDate('date_presence', $requestDate);
    }
    
    $count = $query->count();
    $results = $query->get();
    
    echo "Query for $requestDate returned: $count records\n";
    foreach ($results as $res) {
        echo "- Found: " . $res->date_presence->format('Y-m-d') . " (" . $res->id . ")\n";
        if ($res->date_presence->format('Y-m-d') !== $requestDate) {
            echo "ERROR: Returned wrong date!\n";
        }
    }
    
    // Cleanup
    $p1->delete();
    $p2->delete();

} catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
