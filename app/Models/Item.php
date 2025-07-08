<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'available',
        'category_id',
    ];

    
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

  
   public function orders()
{
    return $this->belongsToMany(Order::class, 'order_items')->withPivot('quantity', 'price')->withTimestamps();
}

public function recipeIngredients()
{
    return $this->hasMany(RecipeIngredient::class);
}

}
