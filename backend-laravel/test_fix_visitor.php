<?php

use App\Models\Presence;
use App\Models\Activity;
use App\Models\Monitor;
use App\Models\ActivityParticipant;
use Illuminate\Support\Str;

require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    echo "Testing Visitor Fix...\n";
    
    $activity = Activity::first();
    if (!$activity) die("No activity found.\n");

    echo "Activity: " . $activity->id . "\n";
    
    // Create a dummy Visitor in ActivityParticipant
    $visitorId = Str::uuid()->toString();
    
    // We need to create an ActivityParticipant first to simulate finding the name
    // BUT ActivityParticipant requires participant_type enum 'enfant','moniteur'.
    // If the DB has 'visiteur', assume we can insert it (if enum check is loose or updated).
    // If not, we might fail here. Let's try to insert 'visiteur' and see.
    // Actually, let's use 'moniteur' but treat it as a visitor in the request to test the Logic.
    
    $participant = ActivityParticipant::create([
        'activity_id' => $activity->id,
        'participant_id' => $visitorId,
        'participant_nom' => 'Visitor',
        'participant_prenom' => 'Test',
        'participant_nom_complet' => 'Visitor Test',
        'participant_type' => 'moniteur', // Using valid enum but will treat as visitor in logic
        'ajoute_via' => 'manuel',
        'date_ajout' => now()
    ]);
    
    // Test Data simulating request
    $data = [
        'activity_id' => $activity->id,
        'activity_nom' => $activity->title,
        'moniteur_id' => null, 
        'date_presence' => date('Y-m-d'),
        'heure_arrivee' => '09:00',
        'statut' => 'present',
        'participant_id' => $visitorId,
        'participant_type' => 'visiteur', // REQUEST sends 'visiteur'
        'mode_enregistrement' => 'manuel'
    ];

    echo "Data Input: " . json_encode($data) . "\n";

    // SIMULATING CONTROLLER LOGIC (UPDATED):
    $typeMap = [
        'child' => \App\Models\Child::class, // Simplified for test
        'monitor' => \App\Models\Monitor::class,
    ];

    $isVisitor = false;
    if (isset($data['participant_type']) && isset($typeMap[strtolower($data['participant_type'])])) {
        $data['participant_type'] = $typeMap[strtolower($data['participant_type'])];
    } elseif (isset($data['participant_type']) && strtolower($data['participant_type']) === 'visiteur') {
        $isVisitor = true;
    }

    if (empty($data['moniteur_nom'])) {
         $nom = 'Inconnu';
         
         if (!empty($data['participant_id'])) {
             // 1. Try to find via ActivityParticipant
             $accPart = \App\Models\ActivityParticipant::where('activity_id', $data['activity_id'])
                 ->where('participant_id', $data['participant_id'])
                 ->first();
             
             if ($accPart) {
                 $data['moniteur_nom'] = $accPart->participant_nom;
                 $data['moniteur_prenom'] = $accPart->participant_prenom;
                 $data['moniteur_nom_complet'] = $accPart->participant_nom_complet;
                 echo "FOUND NAME: " . $data['moniteur_nom'] . "\n";
             } 
         }
    }

    if ($isVisitor || (isset($data['participant_type']) && !class_exists($data['participant_type']))) {
        echo "Clearing polymorphic fields for Visitor/Invalid...\n";
        $data['participant_id'] = null;
        $data['participant_type'] = null;
    }
    
    echo "Final Data: " . json_encode($data) . "\n";
    
    // Now try to create
    $presence = Presence::create($data);
    echo "Presence created ID: " . $presence->id . "\n";
    echo "Moniteur Nom (Legacy): " . $presence->moniteur_nom . "\n";
    
    // Cleanup
    // $presence->delete();
    // $participant->delete();

} catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}
