<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Escola;
use Illuminate\Support\Facades\Log;

class EscolaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $fileCsv = database_path('seeders'.DIRECTORY_SEPARATOR.'escolas.csv');
        $escolas=\App\Helpers\Util::convertCsvToArray($fileCsv);
        // Ao rodar a seed, o comando a seguir leva um tempo demorado, pois são aproximadamente 180 mil registros a serem inseridos no banco
        collect($escolas)->map(function($escola){ Escola::insert($escola); });

    }
}

