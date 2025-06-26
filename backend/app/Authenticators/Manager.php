<?php

namespace App\Authenticators;

use App\Models\Module;
use Illuminate\Support\Facades\Log;

class Manager
{

    public static function getAuthenticators()
    {
        return [
            
            'App\Authenticators\Local',
            'App\Authenticators\Ldap',
        ];
    }

    public static function getResponse()
    {
        //response padrão para ser utilizada entre os autenticadores
        $resp = new \stdClass();
        $resp->success = false;
        $resp->httpStatusCode = 200;
        $resp->message = [];

        return $resp;
    }

    public static function setResponseToken($response,$token)
    {
        
        //se o usuário nao possuir nenhuma role é que provavelmente veio do primeiro login do ldap.
        //enquanto o admin não add roles pra ele. não será permitido login
        if(sizeof(auth()->user()->roles) == 0){
            $response->success=false;
            $response->httpStatusCode=401;
            $response->message=[
                'error' => "Não autorizado",
            ];

            return;
        }


        //Módulos do frontedn carregados com as roles necessárias para o canLoad
        $modulos = Module::getByUser(auth()->user());

        //User is validated
        $response->success=true;
        $response->httpStatusCode=200;
        $response->message=[
            'access_token' => $token,
            'token_type' => 'bearer',
            'user'       => ['name'=>auth()->user()->name, 'email'=>auth()->user()->email],
            'modules'    => ($modulos->data),//são os modulos que o usuario logado pode acessar
            'expires_in' => auth()->factory()->getTTL() * 60
        ];
    }

}