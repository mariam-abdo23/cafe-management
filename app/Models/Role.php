<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
 use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Passport\HasApiTokens;

class Role extends Model
{
    use HasFactory;

 protected $fillable = ['name'];

public function users(): HasMany {
    return $this->hasMany(User::class);
}

}
