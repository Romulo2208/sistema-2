<?php

namespace App\Http\Controllers;

use App\Models\Monitor;
use Illuminate\Http\Request;
use App\Http\Requests\MonitorRequest;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class MonitorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $monitores=  Monitor::getAllNgSmart();
        return response()->json($monitores->data)
                        ->header('access-control-expose-headers', 'X-Total-Count')
                        ->header('X-Total-Count', $monitores->total);
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
    public function store(MonitorRequest $request)
    {
        //

        $dadosMonitor = $request->all();

        Log::info($request->documentos);

        $newMonitor = Monitor::create($dadosMonitor);

        /*$pasta_documentos = "doc_monitores/".$dadosMonitor['cpf'];


        // if($request->hasFile('documentos')){

            Log::info("upload arquivos");

            $filename  = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();

            Log::info($filename);
            Log::info($extension);
            // Storage::makeDirectory($pasta_documentos);

            // $request->file('documentos')->store('documentos');
        // }





        // $newMonitor['documentos'] = $files = Storage::allFiles($pasta_documentos);*/


        return response()->json($newMonitor, 200);

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Monitor  $monitor
     * @return \Illuminate\Http\Response
     */
    public function show(Monitor $monitor)
    {
        Log::info($monitor);
        return response()->json($monitor, 200);
    }



    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Monitor  $monitor
     * @return \Illuminate\Http\Response
     */
    public function update(MonitorRequest $request, Monitor $monitor)
    {

        $data = $request->all();

        $monitor->update($data);

        return response()->json([
                                'message' => 'Dados do monitor '.$monitor->nome.' atualizados com sucesso!',
                                'monitor'=>$monitor]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Monitores  $monitores
     * @return \Illuminate\Http\Response
     */
    public function destroy(Monitor $monitor)
    {
        //
        //Log::info("monitorzao: ".$monitor->id);
        $pasta_documentos_monitor = "doc_monitores/".$monitor->cpf;
        Storage::deleteDirectory($pasta_documentos_monitor);
        $monitor->delete();

            return response()->json([
                    'message' => 'Monitor excluído com sucesso!'
            ], 200);
    }


    public function deleteFile($file, $monitor_id){
        $monitor = Monitor::findOrFail($monitor_id);

        $pasta_documentos_monitor = "doc_monitores/".$monitor->cpf;

        Storage::delete($pasta_documentos_monitor."/".$file);

        $allFiles = Storage::files($pasta_documentos_monitor);

        $allFiles = str_replace($pasta_documentos_monitor."/", "", $allFiles);//remover o path e deixar somente o nome dos arquivos

        // Log::info($allFiles);

        return response()->json([
            'files' => $allFiles,
            'monitor'=>$monitor]);
    }



    public function uploadFile(Request $request){

        $monitor = Monitor::findOrFail($request->monitor_id);

        if($request->hasFile('file')){

            $pasta_documentos_monitor = "doc_monitores/".$monitor->cpf;

            $file = $request->file;

            $filename  = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();

            $path = $file->storeAs($pasta_documentos_monitor, $filename);

            $allFiles = Storage::files($pasta_documentos_monitor);

            $allFiles = str_replace($pasta_documentos_monitor."/", "", $allFiles);//remover o path e deixar somente o nome dos arquivos

            // Log::info($allFiles);

            return response()->json([
                'files' => $allFiles,
                'monitor'=>$monitor]);
        }
    }



    public function getFiles($monitor_id){

       // Log::info($monitor_id);

        $monitor = Monitor::findOrFail($monitor_id);

        $pasta_documentos_monitor = "doc_monitores/".$monitor->cpf;

        $allFiles = Storage::files($pasta_documentos_monitor);

        $allFiles = str_replace($pasta_documentos_monitor."/", "", $allFiles);//remover o path e deixar somente o nome dos arquivos

        // Log::info($allFiles);

        return response()->json([
            'files' => $allFiles,
            'monitor'=>$monitor]);

    }





    public function downloadFile($file, $monitor_id){

        $monitor = Monitor::findOrFail($monitor_id);

        $pasta_documentos_monitor = "doc_monitores/".$monitor->cpf;

        $path = $pasta_documentos_monitor."/".$file;

        $mimeType = Storage::mimeType($pasta_documentos_monitor."/".$file);

        $headers = [
            'Content-Type'=> $mimeType,
        ];

        $file = Storage::download($path, $file, $headers);

        return $file;

    }

    public function destroyBath(Request $request)
    {
        Monitor::destroy($request->all());
        return response()->json(['message'=>"Monitor(es) apagado(s) com sucesso!"]);
    }

}
