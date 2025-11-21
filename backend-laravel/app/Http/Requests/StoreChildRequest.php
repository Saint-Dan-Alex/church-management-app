<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreChildRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'age' => 'required|integer|min:0|max:18',
            'birthDate' => 'required|date',
            'parentName' => 'required|string|max:255',
            'parentPhone' => 'required|string|max:255',
            'parentEmail' => 'required|email',
            'group' => 'required|string|max:255',
            'allergies' => 'nullable|string',
            'medicalNotes' => 'nullable|string',
            'photo' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ];
    }
}
