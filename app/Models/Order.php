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
        'order_type',
        'delivery_address',
        'phone',
        'status',
        'total_price',
        'reservation_id',
        'payment_method', 
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

public  function reservation()
{
    return $this->belongsTo(Reservation::class);
}
   
    public function invoice()
    {
        return $this->hasOne(Invoice::class);
    }
}
