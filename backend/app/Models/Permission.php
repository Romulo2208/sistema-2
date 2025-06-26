<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Permission extends Model
{

   public $timestamps = true;
   protected $table = 'permissions';

   protected $hidden = ['pivot'];

   public function roles() {
       return $this->belongsToMany('App\Models\Role');
    }

    public function users() {
       return $this->belongsToMany('App\Models\User');
    }

}
