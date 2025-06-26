<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \DB::table('roles')->delete();
        //Auto INCREMENTO NO postgresql não pode colocar exlícito o ID, pois a sequence fica desincronizada
        $roles = [
            ['slug' => 'admin',              'name' => 'Administrador',          'description' => 'Administrador geral',   'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")],
            ['slug' => 'coordenador_geral',  'name' => 'Coordenador Geral',      'description' => 'Coordenador geral',     'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")],
            ['slug' => 'gestor_nacional',    'name' => 'Gestor Nacional',        'description' => 'Gestor Nacional',       'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")],
            ['slug' => 'gestor_regional',    'name' => 'Gestor Regional',        'description' => 'Gestor Regional',       'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")],
            ['slug' => 'coordenador_nucleo', 'name' => 'Coordenador de Núcleo',  'description' => 'Coordenador de Núcleo', 'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")],
        ];

        \App\Models\Role::insert($roles);
    }
}
