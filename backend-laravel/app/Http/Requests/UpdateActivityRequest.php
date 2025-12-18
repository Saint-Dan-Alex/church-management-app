<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateActivityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Les noms doivent correspondre aux colonnes du modèle Activity
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string',
            'type' => 'sometimes|in:libre,gratuite,payante',
            'date' => 'sometimes|date',
            'end_date' => 'sometimes|nullable|date',
            'time' => 'sometimes|string',
            'duration' => 'sometimes|nullable|string',
            'location' => 'sometimes|nullable|string|max:255',
            'category' => 'sometimes|nullable|string|max:255',
            'organizer' => 'sometimes|nullable|string|max:255',
            'maxParticipants' => 'sometimes|nullable|integer|min:0',
            'participants' => 'sometimes|nullable|integer|min:0',
            'price' => 'sometimes|nullable|numeric|min:0',
            'currency' => 'sometimes|nullable|in:CDF,USD',
            'status' => 'sometimes|nullable|in:upcoming,ongoing,completed,cancelled,planifiee,en_cours,terminee,annulee',
        ];
    }
}
