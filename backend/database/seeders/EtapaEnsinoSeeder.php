<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class EtapaEnsinoSeeder extends Seeder
{
    public function run()
    {
        \DB::table('etapas_ensino')->insert([
            ['nome' => 'Ensino Fundamental I'],
            ['nome' => 'Ensino Fundamental II'],
            ['nome' => 'Ensino Médio'],
        ]);
    }
}
