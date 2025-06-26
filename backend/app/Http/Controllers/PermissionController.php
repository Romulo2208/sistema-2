<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use JWTAuth;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Models\PermissionUser;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class PermissionController extends Controller
{   


	public function index(Request $request){
        try{

            $permissions = Permission::All();
  
            return response()->json($permissions);

        }catch (Exception $e) {
            return $e;
        }
    }
    

    public function store(Request $request){

        try {

            $user_Logged = JWTAuth::toUser(JWTAuth::getToken());

            if (!$user_Logged->hasRole("admin")) {
                return response()->json(['error' => 'sem credenciais'], 401);
            }

            $validator = Validator::make($request->all(), [
                'slug'               => 'required|unique:roles|max:255',
                'name'               => 'required|unique:roles|max:255',
                'description'        => 'required',
            ]);

            if($validator->fails()){
                Log::info($validator->errors());
                return response()->json(['error'=>$validator->errors()->first()], 401);
            }
            
            $permission = new Permission();
            $permission->slug         = $request->input('slug');
            $permission->name         = $request->input('name');
            $permission->description  = $request->input('description');
            $permission->created_at  = now();
            $permission->updated_at  = now();


            if($permission->save()){
                return response()->json(['message' => 'Permissão '.$permission->slug.' criada com sucesso!',  'permission'=>$permission], 200);
            }

            return response()->json(['error' => 'Erro ao registrar nova Permissão'], 500);


        } catch (Exception $e) {
            
            Log::error($e->getMessage());

            return response()->json(['error' => $e->getMessage()], 500);
        }
        
    }


    public function update(Request $request, $id) {
        try {

            $user_Logged = JWTAuth::toUser(JWTAuth::getToken());

            if (!$user_Logged->hasRole("admin")) {
                return response()->json(['error' => 'sem credenciais'], 400);
            }

            $permission = Permission::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'slug'               => 'required|unique:roles|max:255',
                'name'               => 'required|unique:roles|max:255',
                'description'        => 'required',
            ]);
            
            if($validator->fails()){
                Log::info($validator->errors());
                return response()->json(['error'=>$validator->errors()->first()], 401);
            }
                
            $permission->slug         = $inputs['slug'];
            $permission->name         = $inputs['name'];
            $permission->description  = $inputs['description'];
            $permission->updated_at  = now();
            

            if($permission->save()){
                return response()->json(['message' => 'Permissão '.$permission->slug.' atualizada com sucesso!',  'permission'=>$permission], 200);
            }

            return response()->json(['error' => 'Erro ao registrar nova Permissão'], 500);
    
        
        } catch (Exception $e) {
            
            Log::error($e->getMessage());

            return response()->json(['error' => $e->getMessage()], 500);
        }
    
      }


    public function destroy(Request $request, $id) {

        try {
            $user_Logged = JWTAuth::toUser(JWTAuth::getToken());

            $permission = Permission::findOrFail($id);
         
            if (!$user_Logged->hasRole("admin")) {
                return response()->json(['error' => 'sem credenciais'], 400);
            }

            if ($permission->delete()) {
               
                return response()->json(['message' => 'Permissão '.$permission->slug.' excluída com sucesso!'], 200);
            }

            return response()->json(['error' => 'Erro ao excluir Permissão: '.$permission->slug], 500);
    
        } catch (Exception $e) {

            Log::error($e->getMessage());

            return response()->json(['error' => $e->getMessage()], 500);
        }
    
      }



    public function syncPermissionsRole(Request $request){

        try{

            $role = Role::findOrFail($request->input('role_id'));

            $role->permissions()->sync($request->input('permissions'));

            return response()->json(['message'=> 'Permissões sincronizadas com sucesso!'], 200);

        }catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(["error"=>"Error interno!"], 500);
        }
    }

	

}