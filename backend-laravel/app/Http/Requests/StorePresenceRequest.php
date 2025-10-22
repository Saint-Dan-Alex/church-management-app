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
            'moniteur_id' => 'required|uuid|exists:monitors,id',
            'moniteur_nom' => 'required|string|max:255',
            'moniteur_prenom' => 'required|string|max:255',
            'moniteur_nom_complet' => 'required|string|max:255',
            'date_presence' => 'required|date',
            'heure_arrivee' => 'required|date_format:H:i',
            'heure_depart' => 'nullable|date_format:H:i|after:heure_arrivee',
            'statut' => 'required|in:present,absent,retard,excuse',
            'mode_enregistrement' => 'required|in:qr_code,manuel,auto',
            'remarque' => 'nullable|string',
        ];
    }
}
