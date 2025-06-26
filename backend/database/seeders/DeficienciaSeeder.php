<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DeficienciaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \DB::table('deficiencias')->insert([
            ['tipo' => "Física"],
            ['tipo' => "Visual"],
            ['tipo' => "Auditiva"],
            ['tipo' => "Intelectual"],
        ]);
    }
}
