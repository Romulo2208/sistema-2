<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\MunicipioSeeder;
use Database\Seeders\DeficienciaSeeder;
use Database\Seeders\DiaSeeder;
use Database\Seeders\TurnoSeeder;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\RoleSeeder;
use Database\Seeders\PermissionUserSeeder;
use Database\Seeders\PermissionRoleSeeder;
use Database\Seeders\RoleUserSeeder;
use Database\Seeders\NucleoSeeder;
use Database\Seeders\BeneficiarioSeeder;
use Database\Seeders\UserSeeder;
use Database\Seeders\DiaTurnoSeeder;
use Database\Seeders\ComarSeeder;
use Database\Seeders\EscolaSeeder;
use Database\Seeders\EtapaEnsinoSeeder;
use Database\Seeders\SerieSeeder;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            UserSeeder::class,
            PermissionSeeder::class,
            RoleSeeder::class,
            PermissionUserSeeder::class,
            PermissionRoleSeeder::class,
            RoleUserSeeder::class,
            ComarSeeder::class,


            MunicipioSeeder::class,
            DeficienciaSeeder::class,
            NucleoSeeder::class,
            BeneficiarioSeeder::class,
            ModulesSeeder::class,
            ModuleRoleSeeder::class,
            DiaTurnoSeeder::class,
            EscolaSeeder::class,
            EtapaEnsinoSeeder::class,
            SerieSeeder::class


        ]);
    }
}
