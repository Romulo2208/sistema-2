<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Permission;
use App\Models\Module;
use JWTAuth;


use App\Helpers\Util;


use Illuminate\Support\Facades\Log;

class Role extends Model
{
   public $timestamps = true;

   protected $table = 'roles';
   protected $hidden = ['pivot'];

   /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'slug',
        'name',
        'description',
      
    ];

   
   public function permissions() {
       return $this->belongsToMany(Permission::class);
   }

    public function users() {
        return $this->belongsToMany(User::class);
    }

    public function modules() {
        return $this->belongsToMany(Module::class);
    }


    
    public static function getAll(){

        $user_Logged = JWTAuth::toUser(JWTAuth::getToken());
        //as roles vão ser listadas com base na menor role_id do usuário
        //o usuário so pode ver as roles que são maiores ou igual a menor que ele tem

        $menor_role_id = Util::menorRoleId($user_Logged->roles);

        //o usuário só poder selecioanr as roles com id >= ao dele
        $query = self::select("roles.*");
        $query->with('permissions');
        $query->where('id', '>=', $menor_role_id );

        return $query->get();


   }
   

}
