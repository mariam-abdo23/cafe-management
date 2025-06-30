<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\ResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    use ResponseTrait;

    
   public function signup(Request $request): object
{
    $validation = Validator::make($request->all(), [
        'name' => 'required|string|min:8',
        'email' => 'required|email:dns,rfc|unique:users,email',
        'phone' => 'required|string|min:11',
        'password' => 'required|string|min:8',
        'role_id' => 'exists:roles,id'
    ]);

    if ($validation->fails()) {
        return $this->sendError($validation->errors(), 'Error processing your request');
    }

    try {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role_id' => $request->role_id,
        ]);

        $token = $user->createToken('auth_token')->accessToken;

        return $this->sendSuccess([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->name ?? 'N/A',
            ],
            'token' => $token
        ], 'User created successfully!');
    } catch (\Throwable $th) {
        return $this->sendError(['exception' => $th->getMessage()], 'Error processing your request');
    }
}


    
    public function login(Request $request): object
    {
        $validation = Validator::make($request->all(), [
            'email' => 'required|email:dns,rfc|exists:users,email',
            'password' => 'required|string|min:8',
        ]);

        if ($validation->fails()) {
            return $this->sendError($validation->errors(), 'Error processing your request');
        }

        try {
            $user = User::where('email', $request->email)->first();

            if ($user && Hash::check($request->password, $user->password)) {
                $token = $user->createToken('auth_token')->accessToken;

                return $this->sendSuccess([
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role->name ?? 'N/A'
                    ],
                    'token' => $token
                ], 'Login successful');
            }

            return $this->sendError(['message' => 'Invalid credentials'], 'Login failed');
        } catch (\Throwable $th) {
            return $this->sendError(['exception' => $th->getMessage()], 'Error processing your request');
        }
    }

    
    public function logout(Request $request): object
    {
        $request->user()->token()->revoke();

        return $this->sendSuccess([], 'Logged out successfully');
    }
}
