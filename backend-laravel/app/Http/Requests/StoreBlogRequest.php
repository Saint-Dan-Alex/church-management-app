<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBlogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'author' => 'required|string|max:255',
            'date' => 'nullable|date',
            'category' => 'required|string|max:255',
            'status' => 'required|in:draft,published',
            'views' => 'nullable|integer',
            'image' => 'nullable|string',
        ];
    }
}
