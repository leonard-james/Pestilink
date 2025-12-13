<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PestController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\UserController;
use App\Http\Middleware\EnsureUserIsFarmer;
use App\Http\Middleware\EnsureUserIsCompany;
use App\Http\Middleware\EnsureUserIsAdmin;
use Illuminate\Support\Facades\Route;

// Public API routes (no authentication required)
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
});

// Public service routes
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/suggest', [ServiceController::class, 'suggest']);

// Public pest classification route
Route::post('/pest/classify', [PestController::class, 'classify']);

// Protected API routes (authentication required)
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('profile', [AuthController::class, 'profile']);
    });

    //pest classification route
    Route::post('/pest/classify', [PestController::class, 'classify']);


    // Company service management routes
    Route::prefix('company')->middleware(EnsureUserIsCompany::class)->group(function () {
        Route::get('/services', [ServiceController::class, 'companyServices']);
        Route::post('/services', [ServiceController::class, 'store']);
        Route::put('/services/{id}', [ServiceController::class, 'update']);
        Route::patch('/services/{id}', [ServiceController::class, 'update']);
        Route::delete('/services/{id}', [ServiceController::class, 'destroy']);
        });

    // Booking routes
    Route::prefix('bookings')->group(function () {
        Route::post('/', [BookingController::class, 'store'])->middleware(EnsureUserIsFarmer::class);
        Route::get('/me', [BookingController::class, 'myBookings'])->middleware(EnsureUserIsFarmer::class);
        Route::get('/company', [BookingController::class, 'companyBookings'])->middleware(EnsureUserIsCompany::class);
        Route::get('/all', [BookingController::class, 'allBookings'])->middleware(EnsureUserIsAdmin::class);
        // Status update allows company OR admin (handled in controller)
        Route::patch('/{id}/status', [BookingController::class, 'updateStatus']);
        Route::get('/{id}/audit', [BookingController::class, 'auditTrail'])->middleware(EnsureUserIsAdmin::class);
    });

    // Notification routes
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::patch('/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::patch('/read-all', [NotificationController::class, 'markAllAsRead']);
    });

    // Admin user management routes
    Route::prefix('users')->middleware(EnsureUserIsAdmin::class)->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
    });
});
