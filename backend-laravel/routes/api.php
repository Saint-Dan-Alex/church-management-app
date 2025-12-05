<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\MonitorController;
use App\Http\Controllers\API\ChildController;
use App\Http\Controllers\API\SalleController;
use App\Http\Controllers\API\ActivityController;
use App\Http\Controllers\API\TeachingController;
use App\Http\Controllers\API\WorshipReportController;
use App\Http\Controllers\API\BlogController;
use App\Http\Controllers\API\VideoController;
use App\Http\Controllers\API\PhotoController;
use App\Http\Controllers\API\ExpenseController;
use App\Http\Controllers\API\PaymentController;
use App\Http\Controllers\API\PresenceController;
use App\Http\Controllers\API\CotisationController;
use App\Http\Controllers\API\SortieController;
use App\Http\Controllers\API\RoleController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\NotificationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // Monitors Routes
    Route::apiResource('monitors', MonitorController::class);
    Route::get('monitors-statistics', [MonitorController::class, 'statistics']);

    // Children Routes
    Route::apiResource('children', ChildController::class);
    Route::get('children-statistics', [ChildController::class, 'statistics']);

    // Salles Routes
    Route::apiResource('salles', SalleController::class);

    // Activities Routes
    Route::apiResource('activities', ActivityController::class);
    Route::get('activities/{activity}/statistics', [ActivityController::class, 'statistics']);

    // Teachings Routes
    Route::apiResource('teachings', TeachingController::class);

    // Worship Reports Routes
    Route::apiResource('worship-reports', WorshipReportController::class);
    Route::get('worship-reports-global-statistics', [WorshipReportController::class, 'globalStatistics']);

    // Blog Routes
    Route::apiResource('blogs', BlogController::class);
    Route::get('blogs-published', [BlogController::class, 'published']);

    // Videos Routes
    Route::apiResource('videos', VideoController::class);
    Route::get('videos-featured', [VideoController::class, 'featured']);

    // Photos Routes
    Route::apiResource('photos', PhotoController::class);
    Route::get('photos-albums', [PhotoController::class, 'albums']);

    // Expenses Routes
    Route::apiResource('expenses', ExpenseController::class);
    Route::get('expenses-statistics', [ExpenseController::class, 'statistics']);

    // Payments Routes
    Route::apiResource('payments', PaymentController::class);
    Route::get('payments-statistics', [PaymentController::class, 'statistics']);

    // Presences Routes
    Route::apiResource('presences', PresenceController::class);
    Route::get('presences-statistics', [PresenceController::class, 'statistics']);

    // Cotisations Routes
    Route::apiResource('cotisations', CotisationController::class);
    Route::get('cotisations-statistics', [CotisationController::class, 'statistics']);

    // Sorties Routes
    Route::apiResource('sorties', SortieController::class);
    Route::get('sorties-statistics', [SortieController::class, 'statistics']);

    // Dashboard global statistics
    Route::get('dashboard-statistics', [DashboardController::class, 'statistics']);

    // Notifications Routes
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::get('notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('notifications', [NotificationController::class, 'store']);
    Route::post('notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    Route::post('notifications/{id}/mark-read', [NotificationController::class, 'markAsRead']);
    Route::delete('notifications/{id}', [NotificationController::class, 'destroy']);
    Route::delete('notifications/delete-all-read', [NotificationController::class, 'deleteAllRead']);

    // Roles (Spatie Permission)
    Route::get('roles', [RoleController::class, 'index']);
});

// Health check route
Route::get('health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'Church Management API is running',
        'version' => '1.0.0',
        'timestamp' => now()->toIso8601String()
    ]);
});
