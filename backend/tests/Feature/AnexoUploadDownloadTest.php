<?php

namespace Tests\Feature;

use App\Models\Recado;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AnexoUploadDownloadTest extends TestCase
{
    use RefreshDatabase;

    protected function criarRecado(User $usuario): Recado
    {
        return Recado::create([
            'titulo' => 'Recado de teste',
            'descricao' => 'Teste de anexos',
            'user_id' => $usuario->id,
        ]);
    }

    public function test_usuario_pode_enviar_anexo_valido(): void
    {
        Storage::fake('local');

        $usuario = User::factory()->create();
        $recado = $this->criarRecado($usuario);

        $arquivo = UploadedFile::fake()->create(
            'documento.pdf',
            100,
            'application/pdf'
        );

        $response = $this->actingAs($usuario)
            ->post("/api/recados/{$recado->id}/anexo", [
                'anexo' => $arquivo,
            ], [
                'Accept' => 'application/json',
            ]);

        $response->assertStatus(200);

        $recado->refresh();

        $this->assertNotNull($recado->anexo);

        $this->assertDatabaseHas('recados', [
            'id' => $recado->id,
            'anexo_nome' => 'documento.pdf',
            'anexo_tipo' => 'application/pdf',
        ]);

        Storage::disk('local')->assertExists($recado->anexo);
    }

    public function test_usuario_pode_baixar_seu_anexo(): void
    {
        Storage::fake('local');

        $usuario = User::factory()->create();
        $recado = $this->criarRecado($usuario);

        Storage::disk('local')->put(
            'anexos/documento.pdf',
            'Conteudo de teste'
        );

        $recado->update([
            'anexo' => 'anexos/documento.pdf',
            'anexo_nome' => 'documento.pdf',
            'anexo_tipo' => 'application/pdf',
            'anexo_tamanho' => 17,
        ]);

        $response = $this->actingAs($usuario)
            ->get("/api/recados/{$recado->id}/anexo");

        $response->assertStatus(200);

        $this->assertStringContainsString(
            'attachment',
            $response->headers->get('content-disposition')
        );

        $this->assertStringContainsString(
            'documento.pdf',
            $response->headers->get('content-disposition')
        );
    }
}
