<?php

namespace Tests\Feature;

use App\Models\Recado;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AnexoValidationTest extends TestCase
{
    use RefreshDatabase;

    protected function criarRecado(User $usuario): Recado
    {
        return Recado::create([
            'titulo' => 'Recado de teste',
            'descricao' => 'Teste de validação de anexos',
            'user_id' => $usuario->id,
        ]);
    }

    public function test_bloqueia_arquivo_maior_que_5mb(): void
    {
        Storage::fake('local');

        $usuario = User::factory()->create();
        $recado = $this->criarRecado($usuario);

        $arquivo = UploadedFile::fake()->create(
            'arquivo.pdf',
            5121,
            'application/pdf'
        );

        $response = $this->actingAs($usuario)
            ->postJson("/api/recados/{$recado->id}/anexo", [
                'anexo' => $arquivo,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('anexo');

        $this->assertNull($recado->fresh()->anexo);
    }

    public function test_bloqueia_formato_nao_permitido(): void
    {
        Storage::fake('local');

        $usuario = User::factory()->create();
        $recado = $this->criarRecado($usuario);

        $arquivo = UploadedFile::fake()->create(
            'programa.exe',
            100,
            'application/octet-stream'
        );

        $response = $this->actingAs($usuario)
            ->postJson("/api/recados/{$recado->id}/anexo", [
                'anexo' => $arquivo,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('anexo');

        $this->assertNull($recado->fresh()->anexo);
    }

    public function test_bloqueia_upload_sem_arquivo(): void
    {
        $usuario = User::factory()->create();
        $recado = $this->criarRecado($usuario);

        $response = $this->actingAs($usuario)
            ->postJson("/api/recados/{$recado->id}/anexo", []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('anexo');
    }
}
