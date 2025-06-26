<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;


class PermissionRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        /*
        *   Role 1 Admin
        *   Role 2 moderator
        *   Role 3 parceiro
        *   Role 4 cliente
        */
        \DB::table('permission_role')->delete();

        $permission_role = [
            //role admin
            ['permission_id' => '1',       'role_id' => '1', 'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")], // permissão de login para geral
            ['permission_id' => '2',       'role_id' => '1', 'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")], // permissão de criar
            ['permission_id' => '3',       'role_id' => '1', 'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")], // permissão de atualizar
            ['permission_id' => '4',       'role_id' => '1', 'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")], // permissão de deletar
            
        ];

        \App\Models\PermissionRole::insert($permission_role);
    }
}
