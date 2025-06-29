
<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Container\Attributes\Auth;


Route::middleware('throttle:60,1')->group(function () {

    Route::prefix('user')->group(function () {

    Route::post('signup', [AuthController::class, 'signup']);
    Route::post('login', [AuthController::class, 'login']);

    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');
});

});