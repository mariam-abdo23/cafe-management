<?php

use App\Console\Commands\UpdateTableStatus;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DiningTableController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\ItemController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\ShiftController;
use App\Http\Controllers\Api\StaffProfileController;

Route::middleware('throttle:60,1')->group(function () {

   
    Route::prefix('user')->group(function () {
        Route::post('signup', [AuthController::class, 'signup']);
        Route::post('login', [AuthController::class, 'login']);
        Route::get('roles', [RoleController::class, 'index']);
    });

    
    Route::middleware('auth:api')->group(function () {
        Route::post('user/logout', [AuthController::class, 'logout']);
        Route::apiResource('categories', CategoryController::class);
        Route::apiResource('items', ItemController::class);
        Route::apiResource('orders', OrderController::class);
        Route::apiResource('dining-tables', DiningTableController::class);
       Route::apiResource('reservations', ReservationController::class);
       Route::get('/update-statuses' , [ReservationController::class,'updateTableStatuses']);
       Route::get('/my-reservation' , [ReservationController::class, 'myReservation']);
       Route::apiResource('inventory', InventoryController::class);
       Route::apiResource('shift', ShiftController::class);
       Route::apiResource('Staff', StaffProfileController::class);
       Route::apiResource('invoices', InvoiceController::class);
    });
});
