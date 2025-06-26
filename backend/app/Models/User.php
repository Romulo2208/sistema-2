<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use Tymon\JWTAuth\Contracts\JWTSubject;
use App\Http\Traits\ACLTrait;

use App\Helpers\Util;

use Illuminate\Support\Facades\Log;

use JWTAuth;
use DB;

class User extends Authenticatable implements JWTSubject
{
    use  HasFactory, Notifiable;
    use ACLTrait; //Import The Trait

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        'password',
    ];

     // Rest omitted for brevity

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return  [
            'type' => 'driver',
            'roles' => $this->roles,
            'permissions' => $this->permissions
        ];
    }




    public static function getAllNgSmart(){
        //recuperar o usuario logado. Ele  vai listar os usuários com exceção de roles  menores que a dele (não vê mais antigo)
        $user_Logged = JWTAuth::toUser(JWTAuth::getToken());
        $menor_role_id = Util::menorRoleId($user_Logged->roles);


        //inicio do processamento do select
        $request = request();

        $page                   = $request->has('_page') ? $request->get('_page') : 1;
        $limit                  = $request->has('_limit') ? $request->get('_limit') : 20;
        $sort                   = $request->has('_sort') ? $request->get('_sort'):"users.id";
        $order                  = $request->has('_order') ? $request->get('_order'):"desc";

        $query = self::query();


        if($request->id_like):
            $query->where('users.id',  $request->id_like);
        endif;

        if($request->email_like):
            $query->where(DB::raw('lower(users.email)'), 'like', "%".strtolower($request->email_like). "%");
        endif;

        if($request->name_like):
            $query->where(DB::raw('lower(users.name)'), 'like', "%".strtolower($request->name_like). "%");
        endif;

        if($request->username_like):
            $query->where(DB::raw('lower(users.username)'), 'like', "%".strtolower($request->username_like). "%");
        endif;

        if($request->created_at_like):
            $query->where('users.created_at', '>=', $request->created_at_like);
        endif;

        if($request->updated_at_like):
            $query->where('users.updated_at', '>=', $request->updated_at_like);
        endif;

        $query->where('users.id', '!=', 1);//ignorar o super admin

        //já armazeno o total da query aqui
        $count = $query->count();


        $query->orderBy($sort, $order);

        $query->with('permissions');
        $query->with('roles');
        $query->whereDoesntHave('roles', function($query) use ($menor_role_id) {
            return $query->where('roles.id', '<', $menor_role_id);
        });

        $query->limit($limit)->offset(($page - 1) * $limit);

        $obj = new \stdClass();
        $obj->count = $count;
        $obj->data  = $query->get();

        return $obj;

    }




    //Relacionamentos para ACL
    public function roles() {
        return $this->belongsToMany('App\Models\Role');
    }

    public function permissions() {
        return $this->belongsToMany('App\Models\Permission');
    }

    public function comars() {
        return $this->belongsToMany('App\Models\Comar');
    }

    public function nucleos() {
        return $this->belongsToMany('App\Models\Nucleo');
    }

    public function userRole()
    {
        return $this->roles()->pluck('slug')->first();
    }
}
