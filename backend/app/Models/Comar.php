<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comar extends Model
{
    use HasFactory;

 //   protected $table = 'comars';

    
    public function nucleos()
    {
        return $this->hasMany(Nucleo::class);
    }


    public function users() {
        return $this->belongsToMany(User::class);
    }
}
