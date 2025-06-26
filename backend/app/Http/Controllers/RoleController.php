<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Http\Requests\RoleRequest;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Models\User;
use Carbon\Carbon;
use App\Models\Role;
use App\Models\RoleUser;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class RoleController extends Controller{
    //
    public function index(Request $request){
        $roles = Role::getAll();
        return response()->json($roles);

    }


    public function getPermissions(Request $request, $id){
        $role = Role::findOrFail($id);
        return response()->json($role->permissions, 200);

    }


    public function show(Role $role){
        return response()->json($role->load('permissions'), 200);
    }


    public function store(RoleRequest $request){
       $role=Role::create($request->all());
       return response()->json(['message' => 'Role '.$role->slug.' criada com sucesso!',  'role'=>$role], 200);
            

    }


    public function update(RoleRequest $request, Role $role) {
          $role->update($request->all());
          return response()->json(['message' => 'Role '.$role->slug.' atualizada com sucesso!',  'role'=>$role], 200);
    
    }

        public function destroy(Role $role)  {
             $role->delete();
            return response()->json(['message' => 'Role '.$role->slug.' excluída com sucesso!'], 200);
        }   


}
