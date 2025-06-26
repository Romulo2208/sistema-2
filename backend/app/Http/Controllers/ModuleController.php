<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Http\Requests\ModuleRequest;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Models\User;
use Carbon\Carbon;
use App\Models\Module;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ModuleController extends Controller{
    //
    public function index(Request $request){
        $modules = Module::getAllNgSmart();

        return response()->json($modules->data)
                        ->header('access-control-expose-headers', 'X-Total-Count')
                        ->header('X-Total-Count', $modules->total);
    }




    public function show(Module $module){
        return response()->json($module->load('permissions'), 200);
    }


    public function store(ModuleRequest $request){
       $module=Module::create($request->all());
       return response()->json(['message' => 'Módulo '.$module->slug.' criado com sucesso!',  'module'=>$module], 200);
    }


    public function update(ModuleRequest $request, Module $module) {
          $module->update($request->all());
          return response()->json(['message' => 'Módulo '.$module->slug.' atualizado com sucesso!',  'module'=>$module], 200);
    
    }

    public function destroy(Module $module)  {
        $module->delete();
        return response()->json(['message' => 'Módulo '.$module->slug.' excluído com sucesso!'], 200);
    }   


    public function getRoles(Request $request, $id){
        $module = Module::findOrFail($id);
        return response()->json($module->roles, 200);
    }

    public function syncRoles(Request $request){

        try{

            $module = Module::findOrFail($request->input('module_id'));

            $module->roles()->sync($request->input('roles'));

            return response()->json(['message'=> 'Roles sincronizadas com sucesso!'], 200);

        }catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(["error"=>"Error interno!"], 500);
        }

    }
    
}
