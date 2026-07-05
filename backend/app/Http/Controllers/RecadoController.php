<?php

namespace App\Http\Controllers;

use App\Models\Recado;
use Illuminate\Http\Request;

class RecadoController extends Controller
{
    public function index(Request $request)
    {
        $recados = Recado::where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($recados);
    }

    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|max:255',
            'descricao' => 'required'
        ]);

        $recado = Recado::create([
            'titulo' => $request->titulo,
            'descricao' => $request->descricao,
            'user_id' => $request->user()->id
        ]);

        return response()->json([
            'message' => 'Recado criado',
            'recado' => $recado
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'titulo' => 'required|max:255',
            'descricao' => 'required'
        ]);

        $recado = Recado::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$recado) {
            return response()->json([
                'message' => 'Recado não encontrado.'
            ], 404);
        }

        $recado->update([
            'titulo' => $request->titulo,
            'descricao' => $request->descricao
        ]);

        return response()->json([
            'message' => 'Recado atualizado com sucesso.',
            'recado' => $recado
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $recado = Recado::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$recado) {
            return response()->json([
                'message' => 'Recado não encontrado.'
            ], 404);
        }

        $recado->delete();

        return response()->json([
            'message' => 'Recado removido'
        ]);
    }
}