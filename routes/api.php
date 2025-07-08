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
use App\Http\Controllers\Api\RecipeIngredientController;

Route::middleware('auth:api')->group(function () {

    // 🧍‍♀ المستخدم
    Route::post('user/logout', [AuthController::class, 'logout']);

    // 📂 الأقسام والمكونات
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('items', ItemController::class);
    Route::apiResource('recipe-ingredients', RecipeIngredientController::class);

    // 🍽 الطاولات والحجوزات
    Route::apiResource('dining-tables', DiningTableController::class);
    Route::apiResource('reservations', ReservationController::class);
    Route::get('/update-statuses' , [ReservationController::class,'updateTableStatuses']);
    Route::get('/my-reservation' , [ReservationController::class, 'myReservation']);

    // 🧾 الطلبات والفواتير
    Route::apiResource('orders', OrderController::class);
    Route::get('/my-orders' , [OrderController::class, 'myOrders']);
    
    Route::apiResource('invoices', InvoiceController::class); 
    Route::get('/invoices/order/{orderId}', [InvoiceController::class, 'showByOrder']);
    Route::post('/invoices/{id}/pay', [InvoiceController::class, 'payInvoice']);
    Route::patch('/invoices/{id}/status', [InvoiceController::class, 'updateStatus']);

    // 👩‍🍳 الموظفين والورديات
    Route::apiResource('staff', StaffProfileController::class);
    Route::apiResource('shifts', ShiftController::class);
});
