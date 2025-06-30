<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiningTable extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'status'];

    
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
    public function reservations()
{
    return $this->hasMany(Reservation::class);
}
}
