<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $usuariosHomologacao = [
            ['username' => 'admin', 'name' => 'Administrador',  'password' => bcrypt('password'), 'email' =>''],
            ['username' => '02917850779', 'name' => 'CL CHACARA (EMAER)',  'password' => bcrypt('password'), 'email' =>'chacaraegc@fab.mil.br'],
        ];

        User::insert($usuariosHomologacao);
        //User::factory(10)->create();
    }
}
