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

    public function destroy($id)
    {
        $recado = Recado::findOrFail($id);

        $recado->delete();

        return response()->json([
            'message' => 'Recado removido'
        ]);
    }
}