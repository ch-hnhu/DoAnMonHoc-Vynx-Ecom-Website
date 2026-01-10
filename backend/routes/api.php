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

Route::get('/products', [ProductController::class, 'index']);
Route::get('/orders', [OrderController::class, 'index']);
Route::delete('/orders/{order}', [OrderController::class, 'destroy']);
Route::get('/users', [UserController::class, 'index']);
Route::delete('/users/{user}', [UserController::class, 'destroy']);
Route::get('/brands', [BrandController::class, 'index']);
Route::delete('/brands/{brand}', [BrandController::class, 'destroy']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
Route::get('/attributes', [AttributeController::class, 'index']);
Route::delete('/attributes/{attribute}', [AttributeController::class, 'destroy']);
Route::get('/promotions', [PromotionController::class, 'index']);
Route::delete('/promotions/{promotion}', [PromotionController::class, 'destroy']);
Route::get('/configurations', [ConfigurationController::class, 'index']);
Route::delete('/configurations/{configuration}', [ConfigurationController::class, 'destroy']);
Route::get('/reviews', [ReviewController::class, 'index']);
Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);

// Protected routes - Require authentication
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
