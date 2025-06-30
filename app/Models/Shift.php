<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shift extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'shift_date',
        'start_time',
        'end_time',
    ];

    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
