<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AnexoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'anexo' => 'required|file|mimes:jpg,jpeg,png,webp,pdf|max:5120',
        ];
    }

    public function messages(): array
    {
        return [
            'anexo.required' => 'Selecione um arquivo.',
            'anexo.file' => 'O arquivo enviado é inválido.',
            'anexo.mimes' => 'Apenas imagens e PDFs são permitidos.',
            'anexo.max' => 'O arquivo deve ter no máximo 5 MB.',
        ];
    }
}
