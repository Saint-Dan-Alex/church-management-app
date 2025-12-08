<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreWorshipReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date' => 'required|date',
            'salle' => 'required|string',
            'orateurs' => 'required|array',
            'orateurs.*' => 'string',
            'predicateur' => 'required|string|max:255',
            'moderateurs' => 'nullable|array',
            'moderateurs.*' => 'string',
            'assistants' => 'nullable|array',
            'assistants.*' => 'string',
            'effectif_freres' => 'required|integer|min:0',
            'effectif_soeurs' => 'required|integer|min:0',
            'offrandes' => 'nullable|string',
            'nombre_nouveaux_venus' => 'required|integer|min:0',
            
            // Nouveaux venus
            'nouveaux_venus' => 'nullable|array',
            'nouveaux_venus.*.prenom' => 'required|string',
            'nouveaux_venus.*.nom' => 'required|string',
            'nouveaux_venus.*.adresse' => 'required|string',
            'nouveaux_venus.*.contact' => 'required|string',
        ];
    }
}
