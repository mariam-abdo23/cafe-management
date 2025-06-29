<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\MessageBag;

trait ResponseTrait
{
    public function sendError(array|MessageBag $data, string $message = 'Error processing your request'): object
    {
        return response()->json([
            'status' => 'fail',
            'message' => $message,
            'errors' => $data
        ], 422);
    }

    public function sendSuccess(array|Collection|AnonymousResourceCollection|JsonResource $data, string $message = 'Request successful'): object
    {
        return response()->json([
            'status' => 'success',
            'message' => $message,
            'data' => $data
        ], 200);
    }
}
