<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTeachingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date_seance' => 'required|date',
            'theme' => 'required|string|max:255',
            'sous_theme' => 'nullable|string|max:255',
            'sujet' => 'required|string|max:255',
            'textes_bibliques' => 'required|string',
            'but_pedagogique' => 'required|string',
            'verset_retenir' => 'required|string',
            'materiel_didactique' => 'nullable|string',
            'sujet_revision' => 'nullable|string',
            'sensibilisation' => 'nullable|string',
            'questions_reponses' => 'nullable|string',
            'question_decouverte' => 'nullable|string',
            'reponse_decouverte' => 'nullable|string',
            'type_contenu' => 'required|in:points_developper,developpement',
            'conclusion' => 'nullable|string',
            
            // Chants
            'chants' => 'nullable|array',
            'chants.*.titre' => 'required|string',
            'chants.*.numero' => 'nullable|string',
            
            // Points à développer
            'points' => 'nullable|array',
            'points.*.titre' => 'required|string',
            'points.*.sous_points' => 'nullable|array',
            'points.*.sous_points.*.contenu' => 'required|string',
            
            // Événements
            'evenements' => 'nullable|array',
            'evenements.*.titre' => 'required|string',
            'evenements.*.enseignements' => 'nullable|array',
            'evenements.*.enseignements.*.contenu' => 'required|string',
        ];
    }
}
