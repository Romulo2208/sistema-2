<?php

namespace App\Http\Controllers;

use App\Models\Escola;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class EscolaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $escolas=  Escola::getAllNgSmart();
        return $escolas->data;


/* 
        $beneficiariosNg=  Beneficiario::getAllNgSmart();
        return response()->json($beneficiariosNg->data)
                        ->header('access-control-expose-headers', 'X-Total-Count')
                        ->header('X-Total-Count', $beneficiariosNg->total); */

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
        $dadosEscola = $request->all();

        Log::info($request->documentos);

        $newEscola = Escola::create($dadosEscola);
        return response()->json($newEscola, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\escola  $escola
     * @return \Illuminate\Http\Response
     */
    public function show(escola $escola)
    {
        //
        return response()->json($escola, 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\escola  $escola
     * @return \Illuminate\Http\Response
     */
    public function edit(escola $escola)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\escola  $escola
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, escola $escola)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\escola  $escola
     * @return \Illuminate\Http\Response
     */
    public function destroy(escola $escola)
    {
        //
        $escola->delete();

            return response()->json([
                    'message' => 'Escola excluída com sucesso!'
            ], 200);
    }
}
