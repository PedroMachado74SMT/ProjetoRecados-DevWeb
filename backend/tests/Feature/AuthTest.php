<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withHeader('Origin', 'http://localhost:5173');
        $this->withHeader('Referer', 'http://localhost:5173/');

        $this->withSession([
            '_token' => 'token-teste-123',
        ]);

        $this->withHeader('X-CSRF-TOKEN', 'token-teste-123');
    }

    public function test_usuario_pode_se_cadastrar(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Usuario Teste',
            'email' => 'teste@example.com',
            'password' => 'senha123',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('user.email', 'teste@example.com');

        $this->assertDatabaseHas('users', [
            'email' => 'teste@example.com',
            'role' => 'user',
        ]);

        $usuario = User::where(
            'email',
            'teste@example.com'
        )->firstOrFail();

        $this->assertTrue(
            Hash::check('senha123', $usuario->password)
        );

        $this->assertNotEquals(
            'senha123',
            $usuario->password
        );
    }

    public function test_usuario_pode_fazer_login(): void
    {
        User::factory()->create([
            'email' => 'login@example.com',
            'password' => Hash::make('senha123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'login@example.com',
            'password' => 'senha123',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('user.email', 'login@example.com');

        $this->assertAuthenticated();
    }

    public function test_login_com_senha_errada_e_bloqueado(): void
    {
        User::factory()->create([
            'email' => 'login@example.com',
            'password' => Hash::make('senha123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'login@example.com',
            'password' => 'senhaerrada',
        ]);

        $response->assertStatus(401);

        $this->assertGuest();
    }

    public function test_usuario_pode_fazer_logout(): void
    {
        $usuario = User::factory()->create();

        $response = $this->actingAs($usuario, 'web')
            ->postJson('/api/logout');

        $response->assertStatus(200);

        $this->assertGuest('web');
    }

    public function test_visitante_nao_pode_acessar_recados(): void
    {
        $response = $this->getJson('/api/recados');

        $response->assertStatus(401);
    }
}
