<?php

namespace Tests\Feature;

use App\Models\Recado;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RecadoSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_usuario_nao_pode_editar_recado_de_outro(): void
    {
        $dono = User::factory()->create();
        $outroUsuario = User::factory()->create();

        $recado = Recado::create([
            'titulo' => 'Recado original',
            'descricao' => 'Conteúdo original',
            'user_id' => $dono->id,
        ]);

        $response = $this->actingAs($outroUsuario)
            ->putJson("/api/recados/{$recado->id}", [
                'titulo' => 'Título alterado',
                'descricao' => 'Conteúdo alterado',
            ]);

        $response->assertStatus(404);

        $this->assertDatabaseHas('recados', [
            'id' => $recado->id,
            'titulo' => 'Recado original',
            'descricao' => 'Conteúdo original',
        ]);
    }

    public function test_usuario_nao_pode_excluir_recado_de_outro(): void
    {
        $dono = User::factory()->create();
        $outroUsuario = User::factory()->create();

        $recado = Recado::create([
            'titulo' => 'Recado protegido',
            'descricao' => 'Não pode ser excluído',
            'user_id' => $dono->id,
        ]);

        $response = $this->actingAs($outroUsuario)
            ->deleteJson("/api/recados/{$recado->id}");

        $response->assertStatus(404);

        $this->assertDatabaseHas('recados', [
            'id' => $recado->id,
        ]);
    }

    public function test_usuario_so_visualiza_seus_proprios_recados(): void
    {
        $usuario = User::factory()->create();
        $outroUsuario = User::factory()->create();

        Recado::create([
            'titulo' => 'Meu recado',
            'descricao' => 'Visível para mim',
            'user_id' => $usuario->id,
        ]);

        Recado::create([
            'titulo' => 'Recado secreto',
            'descricao' => 'Pertence a outra pessoa',
            'user_id' => $outroUsuario->id,
        ]);

        $response = $this->actingAs($usuario)
            ->getJson('/api/recados');

        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment([
                'titulo' => 'Meu recado',
            ])
            ->assertJsonMissing([
                'titulo' => 'Recado secreto',
            ]);
    }
}
