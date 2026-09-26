<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RecadoController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/recados', [RecadoController::class, 'index']);

    Route::post('/recados', [RecadoController::class, 'store']);

    Route::put('/recados/{id}', [RecadoController::class, 'update']);

    Route::delete('/recados/{id}', [RecadoController::class, 'destroy']);

});
