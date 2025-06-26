<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Comar;

class ComarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $comars = [
            ['descricao' => 'I COMAR',   'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")],
            ['descricao' => 'II COMAR',  'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")],
            ['descricao' => 'III COMAR', 'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")],
            ['descricao' => 'IV COMAR',  'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")],
            ['descricao' => 'V COMAR',   'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")],
            ['descricao' => 'VI COMAR',  'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")],
            ['descricao' => 'VII COMAR', 'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")],
        ];

        Comar::insert($comars);
    }
}
