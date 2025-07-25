<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shift extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'start_time',
        'end_time',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class)
                    ->withPivot('shift_date')
                    ->withTimestamps();
    }
}
