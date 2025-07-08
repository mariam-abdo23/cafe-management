<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'quantity',
        'unit',
        'threshold',
    ];

    public function recipeIngredients()
{
    return $this->hasMany(RecipeIngredient::class);
}

}
