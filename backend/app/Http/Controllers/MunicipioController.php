<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Municipio;

class MunicipioController extends Controller
{
    public function index()
    {
        $municipios=  Municipio::getAllByFiltros();

        return response()->json($municipios);
       
    }

    public function getRegioes()
    {
        $regioes=  Municipio::getRegioes();

        return response()->json($regioes);
    }

    public function getUfs()
    {
        $ufs=  Municipio::getUfs();

        return response()->json($ufs);
    }
}
