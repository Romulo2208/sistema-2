<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\DeficienciaRequest;
use App\Models\Deficiencia;

class DeficienciaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $deficiencias=  Deficiencia::getAllNgSmart();
        return response()->json($deficiencias->data)
                        ->header('access-control-expose-headers', 'X-Total-Count')
                        ->header('X-Total-Count', $deficiencias->total);

    }

    public function store(DeficienciaRequest $request){
        $deficiencia=Deficiencia::create($request->all());
        return response()->json(['message' => 'Defici�ncia '.$deficiencia->tipo.' criada com sucesso!',  'deficiencia'=>$deficiencia], 200);
     }
 

    public function update(DeficienciaRequest $request, Deficiencia $deficiencia) {
        $deficiencia->update($request->all());
        return response()->json(['message' => 'Defici�ncia '.$deficiencia->tipo.' atualizada com sucesso!',  'deficiencia'=>$deficiencia], 200);
    }
 
    public function destroy(Deficiencia $deficiencia)  {
        $tipo = $deficiencia->tipo;
        $deficiencia->delete();
        return response()->json(['message' => 'Defici�ncia '.$tipo.' exclu�da com sucesso!'], 200);
    }  



}
