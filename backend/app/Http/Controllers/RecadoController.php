<?php

namespace App\Http\Controllers;

use App\Models\Recado;
use App\Http\Requests\AnexoRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
            'titulo' => 'required|string|max:255',
            'descricao' => 'required|string|max:5000'
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
            'titulo' => 'required|string|max:255',
            'descricao' => 'required|string|max:5000'
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

        if ($recado->anexo) {
            Storage::disk('local')->delete($recado->anexo);
        }

        $recado->delete();

        return response()->json([
            'message' => 'Recado removido'
        ]);
    }

    // Upload do anexo
    public function uploadAnexo(AnexoRequest $request, $id)
    {
        $recado = Recado::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$recado) {
            return response()->json([
                'message' => 'Recado não encontrado.'
            ], 404);
        }

        $arquivo = $request->file('anexo');

        $caminho = $arquivo->store('anexos', 'local');

        if (!$caminho) {
            return response()->json([
                'message' => 'Erro ao armazenar o anexo.'
            ], 500);
        }

        $anexoAntigo = $recado->anexo;

        $recado->update([
            'anexo' => $caminho,
            'anexo_nome' => $arquivo->getClientOriginalName(),
            'anexo_tipo' => $arquivo->getMimeType(),
            'anexo_tamanho' => $arquivo->getSize()
        ]);

        if ($anexoAntigo) {
            Storage::disk('local')->delete($anexoAntigo);
        }

        return response()->json([
            'message' => 'Anexo enviado com sucesso.',
            'recado' => $recado
        ]);
    }

    // Download do anexo
    public function downloadAnexo(Request $request, $id)
{
    $recado = Recado::find($id);

    if (!$recado || !$recado->anexo) {
        return response()->json([
            'message' => 'Anexo não encontrado.'
        ], 404);
    }

    if (
        !$request->user()->isAdmin() &&
        $recado->user_id != $request->user()->id
    ) {
        return response()->json([
            'message' => 'Acesso negado.'
        ], 403);
    }

    if (!Storage::disk('local')->exists($recado->anexo)) {
        return response()->json([
            'message' => 'Arquivo não encontrado.'
        ], 404);
    }

    return Storage::disk('local')->download(
        $recado->anexo,
        $recado->anexo_nome
    );
}
    // Listar todos os recados (administrador)
    public function adminIndex()
    {
    $recados = Recado::with('user:id,name,email')
        ->latest()
        ->get();

    return response()->json($recados);
    }
}
