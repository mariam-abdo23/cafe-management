<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'             => $this->id,
            'user'           => [
                'id'   => $this->user->id ?? null,
                'name' => $this->user->name ?? null,
            ],
            'dining_table'   => [
                'id'   => $this->diningTable->id ?? null,
                'name' => $this->diningTable->name ?? null,
            ],
            'order_type'     => $this->order_type, 
            'status'         => $this->status,
            'total_price'    => $this->total_price,
            'items'          => $this->items->map(function ($item) {
                return [
                    'id'       => $item->id,
                    'name'     => $item->name,
                    'price'    => $item->pivot->price,
                    'quantity' => $item->pivot->quantity,
                ];
            }),
            'created_at'     => $this->created_at,
        ];
    }
}