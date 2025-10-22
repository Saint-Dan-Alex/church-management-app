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
            'category' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'status' => 'required|in:draft,published',
            'image' => 'nullable|string',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
        ];
    }
}
