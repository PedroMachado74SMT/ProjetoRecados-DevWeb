<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('recados', function (Blueprint $table) {
            $table->string('anexo')->nullable();
            $table->string('anexo_nome')->nullable();
            $table->string('anexo_tipo')->nullable();
            $table->unsignedBigInteger('anexo_tamanho')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('recados', function (Blueprint $table) {
            $table->dropColumn([
                'anexo',
                'anexo_nome',
                'anexo_tipo',
                'anexo_tamanho'
            ]);
        });
    }
};
