<?php

use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\AttributeController;
use App\Http\Controllers\Api\PromotionController;
use App\Http\Controllers\Api\ConfigurationController;
use App\Http\Controllers\Api\ReviewController;
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

// Product routes
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/paginated', [ProductController::class, 'paginated']);
    Route::post('/store', [ProductController::class, 'store']);
    Route::delete('/{id}', [ProductController::class, 'destroy']);  
});

// Resource routes
Route::apiResource('orders', OrderController::class)->only(['index', 'update', 'destroy']);
Route::apiResource('users', UserController::class)->only(['index', 'destroy']);
Route::apiResource('brands', BrandController::class)->only(['index', 'destroy']);
Route::apiResource('categories', CategoryController::class)->only(['index', 'store', 'destroy']);
Route::apiResource('attributes', AttributeController::class)->only(['index', 'destroy']);
Route::apiResource('promotions', PromotionController::class)->only(['index', 'destroy']);
Route::apiResource('configurations', ConfigurationController::class)->only(['index', 'destroy']);
Route::apiResource('reviews', ReviewController::class)->only(['index', 'destroy']);

// Protected routes - Require authentication
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
