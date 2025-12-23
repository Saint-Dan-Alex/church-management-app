<?php

use App\Models\Presence;
use App\Models\Activity;
use App\Models\Monitor;

require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    echo "Testing DB Constraint Fix...\n";
    
    $activity = Activity::first();
    $monitor = Monitor::first();

    echo "Activity: " . ($activity ? $activity->id : 'None') . "\n";
    
    // Test with SIMPLE string type + NO moniteur_nom provided
    $data = [
        'activity_id' => $activity->id,
        'activity_nom' => $activity->title,
        'moniteur_id' => null, 
        'date_presence' => date('Y-m-d'),
        'heure_arrivee' => '09:00',
        'statut' => 'present',
        'participant_id' => $monitor->id,
        'participant_type' => 'monitor', // Using simple string to test both fixes at once
        'mode_enregistrement' => 'manuel'
        // 'moniteur_nom' IS MISSING HERE
    ];

    echo "Creating presence (expecting controller logic to handle missing moniteur_nom)...\n";
    
    // We can't call Presence::create($data) directly because that bypasses the controller logic I just wrote!
    // The previous test script was flawed because I was testing Model::create directly in the first script, but I needed to test the "Controller logic".
    // Since I cannot easily instantiate the controller with a mocked request here without more bootstrapping, 
    // I will simulate the logic I added to the controller MANUALLY here to ensure it works as PHP code.
    
    // SIMULATING CONTROLLER LOGIC:
    $typeMap = [
        'child' => \App\Models\Child::class,
        'enfant' => \App\Models\Child::class, 
        'monitor' => \App\Models\Monitor::class,
        'moniteur' => \App\Models\Monitor::class,
    ];

    if (isset($data['participant_type']) && isset($typeMap[strtolower($data['participant_type'])])) {
        $data['participant_type'] = $typeMap[strtolower($data['participant_type'])];
    }
    
    if (empty($data['moniteur_nom'])) {
         $nom = 'Inconnu';
         $prenom = '';
         $nomComplet = 'Inconnu';

         if (!empty($data['participant_id']) && !empty($data['participant_type'])) {
             $participantClass = $data['participant_type'];
             if (class_exists($participantClass)) {
                 $participant = $participantClass::find($data['participant_id']);
                 if ($participant) {
                     $nom = $participant->nom ?? 'Inconnu';
                     $prenom = $participant->prenom ?? $participant->postnom ?? ''; 
                     $nomComplet = $participant->nom_complet ?? trim("$nom $prenom");
                 }
             }
         }
         
         $data['moniteur_nom'] = $data['moniteur_nom'] ?? $nom;
         $data['moniteur_prenom'] = $data['moniteur_prenom'] ?? $prenom;
         $data['moniteur_nom_complet'] = $data['moniteur_nom_complet'] ?? $nomComplet;
    }
    
    echo "Data after processing: " . json_encode($data) . "\n";
    
    // Now try to create
    $presence = Presence::create($data);
    echo "Presence created ID: " . $presence->id . "\n";
    
    // Cleanup
    // $presence->delete();

} catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
