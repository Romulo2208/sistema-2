<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\NucleoRequest;
use App\Models\Nucleo;
use Illuminate\Support\Facades\Log;

class NucleoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        // Log::info("Ok");
        // $nucleos=  Nucleo::all();
        $nucleosNg=  Nucleo::getAllNgSmart();
        return response()->json($nucleosNg->data)
                        ->header('access-control-expose-headers', 'X-Total-Count')
                        ->header('X-Total-Count', $nucleosNg->total);
    }

    

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(NucleoRequest $request)
    {

        $data = $request->all();

        Log::info($data);

        $newNucleo = Nucleo::create($data);
        $newNucleo->diaTurnoNucleos()->sync($request->diaTurnoNucleos);

        return response()->json($newNucleo, 201);
        
    }

    /**
     * Display the specified resource.
     *
     * @param  Nucleo  $nucleo
     * @return \Illuminate\Http\Response
     */
    public function show(Nucleo $nucleo)
    {
        return response()->json($nucleo->load('municipio')->load('diaTurnoNucleos'));
    }

   

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  Nucleo  $nucleo
     * @return \Illuminate\Http\Response
     */
    public function update(NucleoRequest $request, Nucleo $nucleo)
    {

        $nucleo->update($request->all());

        $nucleo->diaTurnoNucleos()->sync($request->diaTurnoNucleos);
        // $nucleo->diaTurno()->sync($data['dias_turnos']);
        return response()->json($nucleo);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Nucleo  $nucleo
     * @return \Illuminate\Http\Response
     */
    public function destroy(Nucleo $nucleo)
    {
        try {

            $nucleo->diaTurnoNucleos()->sync([]);
            $nucleo->users()->sync([]);
            
            
            $nucleo->delete();
            
            return response()->json([
                    'message' => 'Núcleo excluído com sucesso!'
            ], 200);

        } catch (\Illuminate\Database\QueryException $e) {

            \Log::error($e->getMessage());

            $message = $e->getMessage();

            if(strpos($e->getMessage(), 'beneficiarios_nucleo_id_foreign')){
                $message = "Erro ao excluir o Núcleo. Existe(m) beneficiário(s) relacionado(s)! Para excluí-lo, desvincule o(s) beneficiário(s) deste Núcleo!";
            }

            return response()->json([
                'error' =>  $message
            ], 500);

        }
    }
}
