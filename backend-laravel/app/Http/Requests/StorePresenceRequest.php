<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePresenceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'activity_id' => 'required|uuid|exists:activities,id',
            'activity_nom' => 'required|string|max:255',
            'participant_id' => 'nullable|uuid|required_without:moniteur_id',
            'participant_type' => 'nullable|string|required_with:participant_id',
            'moniteur_id' => 'nullable|uuid|exists:monitors,id|required_without:participant_id',
            'moniteur_nom' => 'nullable|string|max:255',
            'moniteur_prenom' => 'nullable|string|max:255',
            'moniteur_nom_complet' => 'nullable|string|max:255',
            'date_presence' => 'required|date',
            'heure_arrivee' => 'required|date_format:H:i',
            'heure_depart' => 'nullable|date_format:H:i|after:heure_arrivee',
            'statut' => 'required|in:present,absent,retard,excuse',
            'mode_enregistrement' => 'required|in:qr_code,manuel,auto',
            'remarque' => 'nullable|string',
        ];
    }
}
