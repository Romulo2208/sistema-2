<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Municipio;

class MunicipioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $fileCsv = database_path('seeders'.DIRECTORY_SEPARATOR.'municipios.csv');
        $municipios=\App\Helpers\Util::convertCsvToArray($fileCsv);
        //\DB::table('municipios')->insert($municipios);
        Municipio::insert($municipios);
    }
}
