<?php

namespace App\Http\Middleware;

use Closure;
use JWTAuth;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, $role, $permission = null)
    {
       
        $user = JWTAuth::toUser(JWTAuth::getToken());

        if (strpos($role, '|') !== false) {
            $role = explode("|", $role);
      //      dd(($role));
        }
        
        if (strpos($permission, '|') !== false) {
            $permission = explode("|", $permission);
      //      dd(($role));
        }

       if(is_array($role)){
        //dd($request->user());
            foreach ($role as $rol) {
                if ($user->hasRole($rol)) {
                    return $next($request);
                }
            }
            abort(401);
        }else{
            if(!$user->hasRole($role)) {
                abort(401);
            }
        }
        
        if(is_array($permission)){
            //dd($request->user());
                foreach ($permission as $per) {
                //    dd($user->hasRole($rol));
                    if ($user->can($per)) {
                        return $next($request);
                    }
                }
                abort(401);
        }else{
            if($permission !== null && !$user->can($permission)) {
                abort(401);
            }
        }

        return $next($request);
    }
}
