<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;


class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \DB::table('permissions')->delete();

        $permissions = [
            ['slug' => 'login',              'name' => 'Permite efetuar login',  'description' => 'Permite efetuar login no painel', 'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")],
            ['slug' => 'create',             'name' => 'Criar',                  'description' => 'Permite criar',                   'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")],
            ['slug' => 'update',             'name' => 'Atualizar',              'description' => 'Permite atualizar',               'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")],
            ['slug' => 'delete',             'name' => 'Deletar',                'description' => 'Permite excluir',                 'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")],

        ];

        \App\Models\Permission::insert($permissions);
    }
}
