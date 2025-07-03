<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'dining_table_id',
        'status',
        'total_price',
        'order_type'
    ];

    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

  
    public function diningTable()
    {
        return $this->belongsTo(DiningTable::class);
    }

    
    public function items()
{
    return $this->belongsToMany(Item::class, 'order_items')->withPivot('quantity', 'price')->withTimestamps();
}

   
    public function invoice()
    {
        return $this->hasOne(Invoice::class);
    }
}
