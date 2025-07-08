<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecipeIngredient extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id',
        'inventory_id',
        'quantity',
        'unit',
    ];


    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    
    public function inventory()
    {
        return $this->belongsTo(Inventory::class);
    }
}
