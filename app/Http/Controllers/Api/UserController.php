<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;

class UserController extends Controller
{
    public function staffOnly()
    {
        $staff = User::where('role_id', 3)->get();

        return response()->json([
            'status' => 'success',
            'data' => $staff
        ]);
    }
}
