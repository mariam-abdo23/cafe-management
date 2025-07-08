<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array<string, mixed>
     */
   public function toArray($request)
{
    return [
        'id'          => $this->id,
        'name'        => $this->name,
        'description' => $this->description,
        'price'       => $this->price,
        'available'   => $this->available,
        'category'    => [
            'id'   => $this->category->id ?? null,
            'name' => $this->category->name ?? null,
        ],
        'ingredients' => $this->whenLoaded('recipeIngredients', function () {
            return $this->recipeIngredients->map(function ($ingredient) {
                return [
                    'id'       => $ingredient->id,
                    'inventory_id' => $ingredient->inventory_id,
                    'name'     => $ingredient->inventory->name ?? null,
                    'quantity' => $ingredient->quantity,
                    'unit'     => $ingredient->unit,
                ];
            });
        }),
        'created_at'  => $this->created_at,
        'updated_at'  => $this->updated_at,
    ];
}

}