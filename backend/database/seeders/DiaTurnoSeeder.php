<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DiaTurnoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \DB::table('dia_turnos')->insert([
            ['descricao' => "Segunda / Manhã"],
            ['descricao' => "Segunda / Tarde"],
            ['descricao' => "Terça / Manhã"],
            ['descricao' => "Terça / Tarde"],
            ['descricao' => "Quarta / Manhã"],
            ['descricao' => "Quarta / Tarde"],
            ['descricao' => "Quinta / Manhã"],
            ['descricao' => "Quinta / Tarde"],
            ['descricao' => "Sexta / Manhã"],
            ['descricao' => "Sexta / Tarde"],
        ]);
    }
}
