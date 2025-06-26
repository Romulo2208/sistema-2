<?php

namespace App\Http\Traits;


use Illuminate\Support\Facades\Log;

trait ACLTrait {


  public function hasRole( ... $p_roles) {
   
    foreach($p_roles as $role){
      if ($this->roles->contains('slug', $role)) {
        return true;
      }
    }

    return false;

  }


  /**
   * Verifica se o usuário contém a permissão ou se a role contém a permissão
   */
  public function hasPermission( ... $p_permissions) {
    
    // Se o usuario contém a permissão
    foreach($p_permissions as $permission){
      if($this->permissions->contains('slug', $permission)){
        // Log::info("O Usuário ". $this->onme_completo . " possui a permissão: ".$p_permission);
        // Log::info($permission);
        // Log::info("--*--");
        return true;
      }
    }
   
    
    //Verificar se as role contem a permissão
    foreach($p_permissions as $permission){

      foreach($this->roles as $role){
        if($role->permissions->contains('slug', $permission)){
          // Log::info("Role ". $role->slug . " possui a permissão: ".$permission);
          // Log::info($role->permissions);
          // Log::info("--*--");
          return true;
        }
      }

    }

   

    // se o usuário ou a role não tiver a permissão é false
    return false;

  }

 
}