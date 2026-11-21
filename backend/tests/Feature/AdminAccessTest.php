<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_usuario_comum_nao_pode_acessar_area_admin(): void
    {
        $usuario = User::factory()->create([
            'role' => 'user',
        ]);

        $response = $this->actingAs($usuario)
            ->getJson('/api/admin/recados');

        $response->assertStatus(403);
    }

    public function test_admin_pode_acessar_area_admin(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this->actingAs($admin)
            ->getJson('/api/admin/recados');

        $response->assertStatus(200);
    }

    public function test_visitante_nao_pode_acessar_area_admin(): void
    {
        $response = $this->getJson('/api/admin/recados');

        $response->assertStatus(401);
    }
}
