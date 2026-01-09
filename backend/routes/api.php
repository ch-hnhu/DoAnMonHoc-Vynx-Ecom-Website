<?php

use App\Http\Controllers\Api\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes - Test
Route::get('/', function () {
    return response()->json([
        'message' => 'API is working!',
        'timestamp' => now(),
    ]);
});

Route::get('/test', function () {
    return response()->json([
        'message' => 'hehe tako nek!'
    ]);
});

Route::get('/products', [ProductController::class, 'index']);

// Protected routes - Require authentication
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
