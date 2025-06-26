<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\UserRequest;
use Illuminate\Support\Facades\Hash;

use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

use App\Models\Role;
use Illuminate\Support\Facades\Log;

// use App\Helpers\RolesHelper;


class UserController extends Controller
{
    public function index(Request $request)
    {
        $result = User::getAllNgSmart();

        return response()->json($result->data)
                            ->header('access-control-expose-headers', 'X-Total-Count')
                            ->header('X-Total-Count', $result->count);
    }


    public function show(User $user)
    {
        return response()->json($user->load('roles', 'permissions', 'comars', 'nucleos'));
    }



    public function store(UserRequest $request)
    {
        $user=User::create($this->tratarDadosRequest($request));

        if ($user->save()) {
            
            // se tiver as roles
            if($request->roles):
                $user->roles()->sync($request->roles);
            endif;

            // montar o relacionamento dos comars que o usuario pode listar 
            if ($request->comars):
                $user->comars()->sync($request->comars); 
            endif;

            //montar o relacionamento users -> nucleo 
            if($request->nucleos):
                $user->nucleos()->sync($request->nucleos);
            endif;

            return response()->json(['message'=> 'Novo usuário '.$user->name.' criado com sucesso!'], 200);
        }

        return response()->json(["error"=>"Error interno!"], 500);
    }



    public function update(UserRequest $request, User $user)
    {
        // Log::info($request);

        // return response()->json(['message'=> $request], 400);

        $retorno=$user->update($this->tratarDadosRequest($request));

        // se tiver as roles
        if($request->roles):
            $user->roles()->sync($request->roles);
        endif;

        // montar o relacionamento dos comars que o usuario pode listar 
        if ($request->comars):
            $user->comars()->sync($request->comars); 
        endif;

        //montar o relacionamento users -> nucleo 
        if($request->nucleos):
            $user->nucleos()->sync($request->nucleos);
        endif;

        return response()->json(['message'=> 'Dados do usuário '.$user->name.' atualizado com sucesso!'], 200);
    }




    public function destroy(User $user)
    {
        $remover = $user->delete();
        if ($remover) {
            $msg = "Conta ". $user->name . " excluída com sucesso!";
            return response()->json(['message'=>$msg], 200);
        }
        return response()->json(["error"=>"Error interno!"], 500);
    }


    public function getAuthenticatedUser()
    {
        try {
            if (! $user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['user_not_found'], 404);
            }
        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['token_expired'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['token_invalid'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['token_absent'], $e->getStatusCode());
        }

        return response()->json(compact('user'));
    }


    private function tratarDadosRequest($request)
    {
        $dados=$request->all();
        if (isset($dados['password'])&& $dados['password']):
            $dados['password'] = Hash::make($dados['password']); else:
            unset($dados['password']);
        endif;
        return $dados;
    }

    public function getUserLdap($cpf)
    {
        try{
            return response()->json( \App\Helpers\Ldap::getMilitar($cpf));
        
        }
        catch(\Exception $e){
            return response()->json(["error"=>"Error ao pesquisar no LDAP!"], 500);
        }
      
    }

    public function destroyBath(Request $request)
    {
        User::destroy($request->all());
        return response()->json(['message'=>"Usuários apagados com sucesso!"]);
    }
}
