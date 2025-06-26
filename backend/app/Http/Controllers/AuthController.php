<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Validator;
use App\Authenticators\Manager;
use Illuminate\Support\Facades\Log;


class AuthController extends Controller
{

    public function authenticate(Request $request)
    {


        $autenticadores=Manager::getAuthenticators();
        $responseAutenticadores=Manager::getResponse();

        $credentials = $request->only('username', 'password');

        foreach($autenticadores as $autenticador){
             $autenticador::authenticate($credentials,$responseAutenticadores);
             if($responseAutenticadores->success){
                 break;
             }


        }

        if($responseAutenticadores->success){
            \Log::info('Login bem-sucedido:', [
                'message' => $responseAutenticadores->message
            ]);
            return response()->json($responseAutenticadores->message);
        }
        else{
            return response()->json([
                'error' => $responseAutenticadores->message,

            ],$responseAutenticadores->httpStatusCode);
        }


    }




}
