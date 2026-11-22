<?php

namespace Tests\Feature;

use App\Models\Recado;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RecadoCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_usuario_pode_criar_recado(): void
    {
        $usuario = User::factory()->create();

        $response = $this->actingAs($usuario)
            ->postJson('/api/recados', [
                'titulo' => 'Meu primeiro recado',
                'descricao' => 'Descrição do recado',
            ]);

        $response->assertSuccessful();

        $this->assertDatabaseHas('recados', [
            'titulo' => 'Meu primeiro recado',
            'descricao' => 'Descrição do recado',
            'user_id' => $usuario->id,
        ]);
    }

    public function test_usuario_pode_editar_seu_recado(): void
    {
        $usuario = User::factory()->create();

        $recado = Recado::create([
            'titulo' => 'Título antigo',
            'descricao' => 'Descrição antiga',
            'user_id' => $usuario->id,
        ]);

        $response = $this->actingAs($usuario)
            ->putJson("/api/recados/{$recado->id}", [
                'titulo' => 'Título atualizado',
                'descricao' => 'Descrição atualizada',
            ]);

        $response->assertSuccessful();

        $this->assertDatabaseHas('recados', [
            'id' => $recado->id,
            'titulo' => 'Título atualizado',
            'descricao' => 'Descrição atualizada',
            'user_id' => $usuario->id,
        ]);
    }

    public function test_usuario_pode_excluir_seu_recado(): void
    {
        $usuario = User::factory()->create();

        $recado = Recado::create([
            'titulo' => 'Recado para excluir',
            'descricao' => 'Este recado será removido',
            'user_id' => $usuario->id,
        ]);

        $response = $this->actingAs($usuario)
            ->deleteJson("/api/recados/{$recado->id}");

        $response->assertSuccessful();

        $this->assertDatabaseMissing('recados', [
            'id' => $recado->id,
        ]);
    }
}
