<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Models\Child;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('children:reassign-salles', function () {
    $updated = 0; $checked = 0;
    Child::query()->orderBy('id')->chunk(500, function ($chunk) use (&$updated, &$checked) {
        foreach ($chunk as $child) {
            $checked++;
            $target = $child->computeSalleForAge();
            if (($child->salle_id !== $target['salle_id']) || ($child->salle_nom !== $target['salle_nom'])) {
                $child->salle_id = $target['salle_id'];
                $child->salle_nom = $target['salle_nom'];
                $child->save();
                $updated++;
            }
        }
    });
    $this->info("Children checked: {$checked}, updated: {$updated}");
})->purpose('Recalcule et met à jour la salle des enfants selon l\'âge actuel');
