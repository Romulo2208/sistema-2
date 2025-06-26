<?php

namespace App\Authenticators;

use Illuminate\Support\Facades\Validator;
use JWTAuth;
use App\Models\User;
use App\Authenticators\Manager;

class Local
{
   
   public static function authenticate($credentials,$response){

   
        //valid credential
        $validator = Validator::make($credentials, [
            'username' => 'required',
            'password' => 'required|string|min:6|max:50'
        ]);


        //Send failed response if request is not valid
        if ($validator->fails()) {
            $response->success=false;
            $response->httpStatusCode=400;
            $response->message=$validator->errors()->first();
            return false;
        }

     
        if (! $token = JWTAuth::attempt($credentials)) {
            $response->success=false;
            $response->httpStatusCode=401;
            $response->message=trans('messages.credentialsInvalid');
           return false;
        }
       


        //Request is validated
        //Crean token
        Manager::setResponseToken($response,$token);
       
        return true;


   }

    
}