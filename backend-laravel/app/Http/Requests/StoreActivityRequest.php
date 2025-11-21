<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreActivityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i',
            'duration' => 'required|string|max:50',
            'location' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'type' => 'required|in:gratuite,payante',
            'participants' => 'nullable|integer',
            'maxParticipants' => 'nullable|integer',
            'status' => 'required|in:upcoming,ongoing,completed',
            'organizer' => 'required|string|max:255',
        ];
    }
}
