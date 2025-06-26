<?php

namespace App\Helpers;

use Carbon\Carbon;

class Util {

    public static function dataToMysql($data)
    {
        $dtCarbon = Carbon::createFromFormat('d/m/Y', $data);
        return $dtCarbon->format('Y-m-d');
    }

    public static function moneyToBr($valor)
    {
        if ($valor):
            return "R$ " . number_format($valor, 2, ',', '.');
        endif;
    }

    public static function convertCsvToArray($fileCsv)
    {
        $array = array_map('str_getcsv', file($fileCsv));
        array_walk($array, function (&$a) use ($array) {
            $a = array_combine($array[0], $a);
        });
        array_shift($array); # remove column header

        return $array;
        //caso queira retornar json ao invés de array só executar trecho abaixo
        //$json = json_encode($array);
        //return $json;
    
    }



    public static function menorRoleId($roles)
    {
        $roles_id = [];

        foreach($roles as $role){
            array_push($roles_id, $role->id);
        }

        return min($roles_id);
    }

}