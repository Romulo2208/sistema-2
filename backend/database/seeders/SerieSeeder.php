<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class SerieSeeder extends Seeder
{
    public function run()
    {
        \DB::table('series')->insert([
            ['etapa_ensino_id' => 2, 'nome' => '1º Ano'],
            ['etapa_ensino_id' => 2, 'nome' => '2º Ano'],
            ['etapa_ensino_id' => 2, 'nome' => '3º Ano'],
            ['etapa_ensino_id' => 2, 'nome' => '4º Ano'],
            ['etapa_ensino_id' => 2, 'nome' => '5º Ano'],
            ['etapa_ensino_id' => 3, 'nome' => '6º Ano'],
            ['etapa_ensino_id' => 3, 'nome' => '7º Ano'],
            ['etapa_ensino_id' => 3, 'nome' => '8º Ano'],
            ['etapa_ensino_id' => 3, 'nome' => '9º Ano'],
            ['etapa_ensino_id' => 4, 'nome' => '1º Ano'],
            ['etapa_ensino_id' => 4, 'nome' => '2º Ano'],
            ['etapa_ensino_id' => 4, 'nome' => '3º Ano'],
        ]);
    }
}
