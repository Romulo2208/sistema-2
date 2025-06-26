<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ModulesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \DB::table('modules')->delete();
        //Auto INCREMENTO NO postgresql não pode colocar exlícito o ID, pois a sequence fica desincronizada
        $modules = [
            ['slug' => 'beneficiarios',  'name' => 'Beneficiários',  'description' => 'Módulo de Beneficiários',  'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")],
            ['slug' => 'acl',            'name' => 'ACL',            'description' => 'Módulo de ACL',            'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")],
            ['slug' => 'nucleos',        'name' => 'Núcleos',        'description' => 'Módulo de Núcleos',        'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")],
            ['slug' => 'usuarios',       'name' => 'Usuários',       'description' => 'Módulo de Usuários',       'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")],
            ['slug' => 'deficiencias',   'name' => 'Deficiências',   'description' => 'Módulo de Deficiências',   'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")],
        ];

        \App\Models\Module::insert($modules);
    }
}
