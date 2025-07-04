<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'amount',
        'payment_method',
        'status',
    ];

    
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
