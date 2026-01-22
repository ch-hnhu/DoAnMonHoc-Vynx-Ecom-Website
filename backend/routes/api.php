<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\AttributeController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\PromotionController;
use App\Http\Controllers\Api\ConfigurationController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\SupportRequestController;
use App\Http\Controllers\Api\SlideshowController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\DashboardController;
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
Route::post('/vnpay_payment', [PaymentController::class, 'vnpay_payment']);
Route::post('/support-requests', [SupportRequestController::class, 'store']);
Route::apiResource('support-requests', SupportRequestController::class)->only(['index', 'update', 'destroy']);
Route::prefix('support-requests')->group(function () {
    Route::get('/trashed', [SupportRequestController::class, 'trashed']);
    Route::post('/{id}/restore', [SupportRequestController::class, 'restore']);
    Route::delete('/{id}/force', [SupportRequestController::class, 'forceDelete']);
});

// Authentication routes
Route::post('/dang-ky', [AuthController::class, 'register']);
Route::post('/dang-nhap', [AuthController::class, 'login']);

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

// Brand routes
Route::prefix('brands')->group(function () {
    Route::get('/trashed', [BrandController::class, 'trashed']);
    Route::post('/{id}/restore', [BrandController::class, 'restore']);
    Route::delete('/{id}/force', [BrandController::class, 'forceDelete']);
});

// Category routes
Route::prefix('categories')->group(function () {
    Route::get('/trashed', [CategoryController::class, 'trashed']);
    Route::post('/{id}/restore', [CategoryController::class, 'restore']);
    Route::delete('/{id}/force', [CategoryController::class, 'forceDelete']);
});

// Public order routes (for admin)
Route::prefix('orders')->group(function () {
    Route::get('/', [OrderController::class, 'index']);
    Route::get('/trashed', [OrderController::class, 'trashed']);
    Route::post('/{id}/restore', [OrderController::class, 'restore']);
    Route::delete('/{id}/force', [OrderController::class, 'forceDelete']);
    Route::get('/{id}', [OrderController::class, 'show']);
    Route::put('/{id}', [OrderController::class, 'update']);
    Route::put('/{id}/pay-confirm', [OrderController::class, 'confirmPayment']);
    Route::post('/', [OrderController::class, 'store']);
    Route::delete('/{id}', [OrderController::class, 'destroy']);
});

// Attribute routes
Route::prefix('attributes')->group(function () {
    Route::get('/trashed', [AttributeController::class, 'trashed']);
    Route::post('/{id}/restore', [AttributeController::class, 'restore']);
    Route::delete('/{id}/force', [AttributeController::class, 'forceDelete']);
});

Route::prefix('configuration')->group(function () {
    Route::get('/', [ConfigurationController::class, 'index']);
    Route::get('/active', [ConfigurationController::class, 'active']);
    Route::get('/all', [ConfigurationController::class, 'all']);
    Route::get('/{id}', [ConfigurationController::class, 'show']);
    Route::post('/', [ConfigurationController::class, 'store']);
    Route::put('/{id}', [ConfigurationController::class, 'update']);
    Route::delete('/{id}', [ConfigurationController::class, 'destroy']);
});

// Dashboard routes (for admin)
Route::prefix('dashboard')->group(function () {
    Route::get('/statistics', [DashboardController::class, 'statistics']);
    Route::get('/recent-orders', [DashboardController::class, 'recentOrders']);
    Route::get('/chart-data', [DashboardController::class, 'chartData']);
});

// Resource routes
Route::apiResource('contacts', SupportRequestController::class)->only(['index', 'destroy']);
Route::prefix('users')->group(function () {
    Route::get('/trashed', [UserController::class, 'trashed']);
    Route::post('/{id}/restore', [UserController::class, 'restore']);
    Route::delete('/{id}/force', [UserController::class, 'forceDelete']);
});
Route::apiResource('users', UserController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
Route::apiResource('brands', BrandController::class)->only(['index', 'store', 'update', 'destroy']);
Route::apiResource('categories', CategoryController::class)->only(['index', 'store', 'update', 'destroy']);
Route::apiResource('attributes', AttributeController::class)->only(['index', 'destroy']);
Route::prefix('promotions')->group(function () {
    Route::post('/check', [PromotionController::class, 'check']);
    Route::get('/trashed', [PromotionController::class, 'trashed']);
    Route::post('/{id}/restore', [PromotionController::class, 'restore']);
    Route::delete('/{id}/force', [PromotionController::class, 'forceDelete']);
});
Route::apiResource('promotions', PromotionController::class)->only(['index', 'store', 'update', 'destroy']);
Route::apiResource('reviews', ReviewController::class)->only(['index', 'update', 'destroy']);
Route::prefix('reviews')->group(function () {
    Route::get('/trashed', [ReviewController::class, 'trashed']);
    Route::post('/{id}/restore', [ReviewController::class, 'restore']);
    Route::delete('/{id}/force', [ReviewController::class, 'forceDelete']);
});
Route::apiResource('slideshows', SlideshowController::class)->only(['index']);
Route::prefix('blogs')->group(function () {
    Route::get('/trashed', [BlogController::class, 'trashed']);
    Route::post('/{id}/restore', [BlogController::class, 'restore']);
    Route::delete('/{id}/force', [BlogController::class, 'forceDelete']);
});
Route::apiResource('blogs', BlogController::class)->only(['index', 'show', 'store', 'update', 'destroy']);

// Protected routes - Require authentication
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/profile/update', [AuthController::class, 'updateProfile']);

    // Review routes
    Route::get('/reviews/reviewed-orders', [ReviewController::class, 'getReviewedOrders']);
    Route::get('/reviews/pending-orders', [ReviewController::class, 'getPendingReviewOrders']);
    Route::post('/reviews', [ReviewController::class, 'store']);

    // Wishlist routes
    Route::prefix('wishlists')->group(function () {
        Route::get('/', [WishlistController::class, 'index']);
        Route::get('/count', [WishlistController::class, 'count']);
        Route::get('/check/{productId}', [WishlistController::class, 'check']);
        Route::post('/', [WishlistController::class, 'store']);
        Route::delete('/{productId}', [WishlistController::class, 'destroy']);
    });
});
