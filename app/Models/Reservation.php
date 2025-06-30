<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'dining_table_id',
        'reservation_time',
    ];

    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

   
    public function diningTable()
    {
        return $this->belongsTo(DiningTable::class);
    }
}
