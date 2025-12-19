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
            'end_date' => 'nullable|date|after_or_equal:date',
            'time' => 'required|date_format:H:i',
            'duration' => 'required|string|max:50',
            'location' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'type' => 'required|in:libre,payante',
            'price' => 'nullable|numeric|min:0|required_if:type,payante',
            'currency' => 'nullable|string|in:CDF,USD',
            'participants' => 'nullable|integer',
            'maxParticipants' => 'nullable|integer',
            'status' => 'required|in:upcoming,ongoing,completed',
            'organizer' => 'required|string|max:255',
            'audience' => 'nullable|in:public,moniteurs',
        ];
    }
}
