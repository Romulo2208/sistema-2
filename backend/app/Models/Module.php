<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Role;
use JWTAuth;
use DB;
use Illuminate\Support\Facades\Log;

use App\Helpers\Util;


class Module extends Model
{
   public $timestamps = true;


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

  
    public function roles() {
        return $this->belongsToMany(Role::class);
    }

    public static function getAllNgSmart()
    {
        $request=request();
        $page                   = $request->has('_page') ? $request->get('_page') : 1;
        $limit                  = $request->has('_limit') ? $request->get('_limit') : 20;
        $sort                   = $request->has('_sort') ? $request->get('_sort'):"id";
        $order                  = $request->has('_order') ? $request->get('_order'):"asc";

        $query=self::query();

       
        if($request->name_like):
            $query->where(DB::raw('lower(modules.name)'), 'like', "%".strtolower($request->name_like). "%");
        endif;
       
        if($request->slug_like):
            $query->where(DB::raw('lower(modules.slug)'), 'like', "%".strtolower($request->slug_like). "%");
        endif;
       
        if($request->description_like):
            $query->where(DB::raw('lower(modules.description)'), 'like', "%".strtolower($request->description_like). "%");
        endif;


        $total=$query->count();

        $query->with('roles');

        $query->orderBy($sort, $order);
        $query->limit($limit)->offset(($page - 1) * $limit);
       
        $resposta= new \stdClass();
        $resposta->data=$query->get();
        $resposta->total=$total;
       
        return $resposta;

    }

    public static function getByUser($user)
    {

        $roles_user = ($user->load('roles'))->roles;

        $modules = self::with('roles')->get();
        
        // Log::info($roles_user);
        // Log::warning($modules);
        // return null;

        $modulos_permitidos_pelo_usuario = [];

        // Percorrer os modulos
        foreach($modules as $module){

            $module_roles = $module->roles;

            // Percorrer as roles do modulo e verificar se o usuario possui essa role
            foreach($module_roles as $role_module){
                // verificar se o usuário  possuii algumas dessas roles.. se possuir add o modulo->slug no array

                foreach($roles_user as $role_user){

                    if($role_user->id == $role_module->id){
                        // Log::info($module->slug);
                        if(!in_array($module->slug, $modulos_permitidos_pelo_usuario)){
                            array_push($modulos_permitidos_pelo_usuario, $module->slug);
                        }
                    }

                }

            }

        }

        $resposta= new \stdClass();
        $resposta->data= base64_encode(json_encode($modulos_permitidos_pelo_usuario));
        

        return $resposta;

    }


}
