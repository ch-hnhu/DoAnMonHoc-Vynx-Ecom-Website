<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\AttributeController;
use App\Http\Controllers\Api\PromotionController;
use App\Http\Controllers\Api\ConfigurationController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\SupportRequestController;
use App\Http\Controllers\Api\SlideshowController;
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
Route::post('/support-requests', [SupportRequestController::class, 'store']);
Route::apiResource('support-requests', SupportRequestController::class)->only(['index', 'update', 'destroy']);

// Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
// Product routes
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/trashed', [ProductController::class, 'trashed']);
    Route::post('/{id}/restore', [ProductController::class, 'restore']);
    Route::delete('/{id}/force', [ProductController::class, 'forceDelete']);
    Route::get('/{slug}', [ProductController::class, 'show']);
    Route::post('/', [ProductController::class, 'store']);
    Route::put('/{id}', [ProductController::class, 'update']);
    Route::delete('/{id}', [ProductController::class, 'destroy']);
});

Route::prefix('orders')->group(function () {
    Route::get('/', [OrderController::class, 'index']);
    Route::get('/{id}', [OrderController::class, 'show']);
    Route::put('/{id}', [OrderController::class, 'update']);
    Route::delete('/{id}', [OrderController::class, 'destroy']);
});

Route::prefix('configuration')->group(function () {
    Route::get('/', [ConfigurationController::class, 'index']);
    Route::get('/{id}', [ConfigurationController::class, 'show']);
    Route::post('/', [ConfigurationController::class, 'store']);
    Route::put('/{id}', [ConfigurationController::class, 'update']);
    Route::delete('/{id}', [ConfigurationController::class, 'destroy']);
});

// Resource routes
Route::apiResource('contacts', SupportRequestController::class)->only(['index', 'destroy']);
Route::apiResource('users', UserController::class)->only(['index', 'destroy']);
Route::apiResource('brands', BrandController::class)->only(['index', 'destroy']);
Route::apiResource('categories', CategoryController::class)->only(['index', 'store', 'update', 'destroy']);
Route::apiResource('attributes', AttributeController::class)->only(['index', 'destroy']);
Route::apiResource('promotions', PromotionController::class)->only(['index', 'destroy']);
Route::apiResource('reviews', ReviewController::class)->only(['index', 'update', 'destroy']);
Route::apiResource('slideshows', SlideshowController::class)->only(['index']);

// Protected routes - Require authentication
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/profile/update', [AuthController::class, 'updateProfile']);
});
