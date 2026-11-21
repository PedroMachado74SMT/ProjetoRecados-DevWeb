<?php

namespace Tests\Feature;

use App\Models\Recado;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AnexoSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected function criarRecado(User $dono): Recado
    {
        return Recado::create([
            'titulo' => 'Recado com anexo',
            'descricao' => 'Arquivo privado',
            'user_id' => $dono->id,
        ]);
    }

    public function test_usuario_nao_pode_baixar_anexo_de_outro(): void
    {
        Storage::fake('local');

        $dono = User::factory()->create();
        $outroUsuario = User::factory()->create();
        $recado = $this->criarRecado($dono);

        Storage::disk('local')->put('anexos/teste.pdf', 'PDF de teste');

        $recado->update([
            'anexo' => 'anexos/teste.pdf',
            'anexo_nome' => 'teste.pdf',
            'anexo_tipo' => 'application/pdf',
            'anexo_tamanho' => 12,
        ]);

        $response = $this->actingAs($outroUsuario)
            ->getJson("/api/recados/{$recado->id}/anexo");

        $response->assertStatus(403);
    }

    public function test_admin_pode_baixar_anexo_de_outro(): void
    {
        Storage::fake('local');

        $dono = User::factory()->create();
        $admin = User::factory()->create(['role' => 'admin']);
        $recado = $this->criarRecado($dono);

        Storage::disk('local')->put('anexos/teste.pdf', 'PDF de teste');

        $recado->update([
            'anexo' => 'anexos/teste.pdf',
            'anexo_nome' => 'teste.pdf',
            'anexo_tipo' => 'application/pdf',
            'anexo_tamanho' => 12,
        ]);

        $response = $this->actingAs($admin)
            ->get("/api/recados/{$recado->id}/anexo");

        $response->assertStatus(200);

        $this->assertStringContainsString(
            'attachment',
            $response->headers->get('content-disposition')
        );
    }

    public function test_usuario_nao_pode_enviar_anexo_para_recado_de_outro(): void
    {
        Storage::fake('local');

        $dono = User::factory()->create();
        $outroUsuario = User::factory()->create();
        $recado = $this->criarRecado($dono);

        $arquivo = UploadedFile::fake()->create(
            'documento.pdf',
            100,
            'application/pdf'
        );

        $response = $this->actingAs($outroUsuario)
            ->post("/api/recados/{$recado->id}/anexo", [
                'anexo' => $arquivo,
            ], [
                'Accept' => 'application/json',
            ]);

        $response->assertStatus(404);

        $this->assertDatabaseHas('recados', [
            'id' => $recado->id,
            'anexo' => null,
        ]);
    }
}
