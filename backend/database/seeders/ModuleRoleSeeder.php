<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ModuleRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /* 
        Modules:
        *   1 Beneficiários
        *   2 ACL
        *   3 Núcleos
        *   4 Usuários
        *   5 Deficiências

        Role:
        *   1 Administrador
        *   2 Coordenador Geral
        *   3 Gestor Nacional
        *   4 Gestor Regional
        *   5 Coordenador de Núcleo
        */
        \DB::table('module_role')->delete();

        $module_role = [
            ['module_id' => '1',       'role_id' => '1', 'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")], 
            ['module_id' => '1',       'role_id' => '2', 'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")], 
            ['module_id' => '1',       'role_id' => '3', 'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")], 
            ['module_id' => '1',       'role_id' => '4', 'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")], 
            ['module_id' => '1',       'role_id' => '5', 'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")], 
           
            ['module_id' => '2',       'role_id' => '1', 'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")], 

            ['module_id' => '3',       'role_id' => '1', 'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")], 
            ['module_id' => '3',       'role_id' => '2', 'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")], 
            ['module_id' => '3',       'role_id' => '3', 'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")], 
            ['module_id' => '3',       'role_id' => '4', 'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")], 
            ['module_id' => '3',       'role_id' => '5', 'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")], 

            ['module_id' => '4',       'role_id' => '1', 'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")], 
            ['module_id' => '4',       'role_id' => '2', 'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")], 
           
            ['module_id' => '5',       'role_id' => '1', 'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")], 
            ['module_id' => '5',       'role_id' => '2', 'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")], 
            
        ];

        \App\Models\ModuleRole::insert($module_role);
    }
}
