<?php

namespace App\Authenticators;

use App\Models\User;
use App\Authenticators\Manager;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class Ldap 
{
   private static  $host;
    private static  $porta;
    private static  $prefix;
    private static  $sufix;
    private static  $base_dn;
    private static  $con;

   
   public static function authenticate($credentials,$response){
      
      $result_bind=false;
        $user=null; //Obrigatório declarar a variável $user, senão dá erro nas tentativas de usuários inválidos (setResponse())
      //se não estiver modificar o 
      
      //if($user):
      self::setAtributos();
      self::conectar_ldap();
      $dn_user = self::$prefix . $credentials['username'] .  self::$sufix;
      $senha = $credentials['password'];
      $result_bind=@ldap_bind(self::$con, $dn_user, $senha);
   

      //se o login for efetuado pelo ldap com sucesso 
      if($result_bind == true){

         ldap_set_option(self::$con, LDAP_OPT_PROTOCOL_VERSION, 3);

         $filter="(uid=".$credentials['username'].")";
         $justthese =  array("displayname", "mail", "uid");

         // que array zoadis
         $result=ldap_search(self::$con, self::$base_dn, $filter, $justthese);

         $entries = ldap_get_entries(self::$con, $result);
  
         $user = User::firstWhere('username', $credentials['username']);
         //verificar se o usuário se encontra no banco local para efeturar o login
         if(!$user){
            $newUser = new User();
            $newUser->name       = $entries[0]['displayname'][0];
            $newUser->username   = $credentials['username'];
            $newUser->email      = $entries[0]['mail'][0];
            $newUser->password   = Hash::make($credentials['password']);
            if($newUser->save()){
               $user = $newUser;
            }
         }else{   
            //atualizar password se for diferente
            if($user->password != Hash::make($credentials['password'])){
               $user->password = Hash::make($credentials['password']);
               $user->save();
            }
         }

      }
      //endif;

     self::setResponse($result_bind,$response,$user);

      return $result_bind;
    
   }


   private static function setResponse($result_bind, $response,$user){
      if($result_bind && $user):
         $token=auth()->login($user);
         Manager::setResponseToken($response,$token);
      else:
         $response->success=false;
         $response->httpStatusCode=401;
         $response->message=trans('messages.credentialsInvalid');
      endif;
      
   }


   private static function conectar_ldap() {
      self::$con = ldap_connect(self::$host,  self::$porta);
  }



   private static function setAtributos() {
      self::$host =config('authldap.host');
      self::$porta = config('authldap.porta');
      self::$prefix = config('authldap.prefix');
      self::$base_dn = config('authldap.base_dn');
      self::$sufix = "," . self::$base_dn;
  }


    
}