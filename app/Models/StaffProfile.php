<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StaffProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'position',
        'salary',
        'shift_time',
    ];

    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
