<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

   
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function reservations()
{
    return $this->hasMany(Reservation::class);
}


public function shifts()
{
    return $this->belongsToMany(Shift::class)
                ->withPivot('shift_date')
                ->withTimestamps();
}
public function staffProfile()
{
    return $this->hasOne(StaffProfile::class);
}

}
