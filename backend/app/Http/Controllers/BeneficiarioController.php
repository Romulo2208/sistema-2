<?php

namespace App\Http\Controllers;

use App\Models\Beneficiario;
use Illuminate\Http\Request;
use App\Http\Requests\BeneficiarioRequest;
use App\Http\Requests\UniformeRequest;
use App\Http\Requests\AvatarRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;

class BeneficiarioController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        //return response()->json(Beneficiario::all());

        $beneficiariosNg=  Beneficiario::getAllNgSmart();
        return response()->json($beneficiariosNg->data)
                        ->header('access-control-expose-headers', 'X-Total-Count')
                        ->header('X-Total-Count', $beneficiariosNg->total);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(BeneficiarioRequest $request)
    {
        $newBeneficiario = Beneficiario::create($request->all());

        $this->atualizarFrequencia($newBeneficiario, $request);

        $this->saveDeficiencias($newBeneficiario, $request);
       // $this->saveEndereco($newBeneficiario, $request);
        //$this->saveUniforme($newBeneficiario, $request);
        return response()->json($newBeneficiario, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Beneficiario  $beneficiario
     * @return \Illuminate\Http\Response
     */
    public function show(Beneficiario $beneficiario)
    {
        $beneficiarioArray=$beneficiario->load('nucleo.municipio', 'deficiencias',
         'endereco', 'nucleo.diaTurnoNucleos', 'frequenciaBeneficiarios', 'uniforme', 'escola','historicos')->toArray();
        $beneficiarioTratado=Beneficiario::retirarAninhamentoNucleoMunicipio($beneficiarioArray);
        //Log::info("Passou aqui!!!".$beneficiario->cpf);
        $arquivos = $this->getFiles($beneficiario->id);
        $beneficiarioTratado['documentos']= $arquivos;
        $beneficiarioTratado['pjp'] = count($beneficiarioArray['deficiencias']) > 0;

        return response()->json($beneficiarioTratado);
    }



    public function getFiles($beneficiario_id){
         $pasta_documentos_beneficiario = "doc_beneficiarios/".$beneficiario_id;
         $pasta_documentos_beneficiario_img = "doc_beneficiarios/".$beneficiario_id."/autImg";
         $pasta_documentos_beneficiario_med = "doc_beneficiarios/".$beneficiario_id."/autMed";

         $allFiles = Storage::directories($pasta_documentos_beneficiario);
         $allFilesImg = Storage::files($pasta_documentos_beneficiario_img);
         $allFilesMed = Storage::files($pasta_documentos_beneficiario_med);

        if(sizeof($allFiles)>0){
            $allFiles = str_replace($pasta_documentos_beneficiario."/", "", $allFiles);//remover o path e deixar somente o nome dos arquivos
            $allFilesImg = str_replace($pasta_documentos_beneficiario_img."/", "", $allFilesImg);//remover o path e deixar somente o nome dos arquivos IMG
            $allFilesMed = str_replace($pasta_documentos_beneficiario_med."/", "", $allFilesMed);//remover o path e deixar somente o nome dos arquivos IMG
             return [
                 'files' => $allFiles, //na verdade são directories. Pode existir caso de diretório existir mas estar tudo vazio
                 'autMed' => $allFilesMed,
                 'autImg' => $allFilesImg
            ];
        }
        //formato padrão mesmo sem documentos enviados
        return [
           'files' => [],
           'autMed' => [],
           'autImg' => []
        ];
     }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Beneficiario  $beneficiario
     * @return \Illuminate\Http\Response
     */
    public function update(BeneficiarioRequest $request, Beneficiario $beneficiario)
    {

        $data = $request->all();

        $beneficiario->update($data);

        $this->atualizarFrequencia($beneficiario, $request);

        $this->saveDeficiencias($beneficiario, $request);
       // $this->saveEndereco($beneficiario, $request);
       // $this->saveUniforme($beneficiario, $request);
        return response()->json($beneficiario);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Beneficiario  $beneficiario
     * @return \Illuminate\Http\Response
     */
    public function destroy(Beneficiario $beneficiario)
    {
        try {
            $beneficiario->delete();

            return response()->json([
                    'message' => 'Beneficiário excluído com sucesso!'
            ], 200);
        } catch (\Illuminate\Database\QueryException $e) {
            Log::error($e->getMessage());
            return response()->json([
                'error' =>  "Erro ao excluir o Beneficiário!"
            ], 500);
        }
    }


    public function uploadFile(Request $request){
        $beneficiario = Beneficiario::findOrFail($request->beneficiario_id);

        if($request->hasFile('file')){

            $pasta_documentos_beneficiario = "doc_beneficiarios/".$beneficiario->id."/".$request->tipo;

            $file = $request->file;

            $filename  = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            Storage::deleteDirectory($pasta_documentos_beneficiario); //exclui as imagens anteriores para enviar uma nova, que será o arquivo atual do usuário
            $path = $file->storeAs($pasta_documentos_beneficiario, $filename);

            $allFiles = Storage::files($pasta_documentos_beneficiario);

            $allFiles = str_replace($pasta_documentos_beneficiario."/", "", $allFiles);//remover o path e deixar somente o nome dos arquivos

            // Log::info($allFiles);

            return response()->json([
                'files' => $allFiles,
                'monitor'=>$beneficiario]);
        }
    }

    private function saveDeficiencias($beneficiario, $request)
    {
        if (!isset($request->deficiencias)) {

            return $beneficiario->deficiencias()->sync([]);
        }

        $dados = $request->deficiencias ?? [];
        return $beneficiario->deficiencias()->sync($dados);
    }

    private function saveEndereco($beneficiario, $request)
    {
        if (!isset($request->endereco)):
            return false;
        endif;

        $dados=$request->endereco;

        return $beneficiario->endereco()->updateOrCreate([], $dados);
    }

    public function updateEndereco(Request $request, Beneficiario $beneficiario)
    {
        $dados= $request->all();
        return $beneficiario->endereco()->updateOrCreate([], $dados);
    }


    private function saveUniforme($beneficiario, $request)
    {
        if (!isset($request->uniforme)):
            return false;
        endif;

        $dados=$request->uniforme;

        return $beneficiario->uniforme()->updateOrCreate([], $dados);
    }

    public function updateUniforme(UniformeRequest $request, Beneficiario $beneficiario)
    {
        $dados= $request->all();
        return $beneficiario->uniforme()->updateOrCreate([], $dados);
    }



    private function atualizarFrequencia($beneficiario, $request)
    {
        if (isset($request->frequencia_nucleo)):
            $dia_turno = [];

            foreach ($request->frequencia_nucleo as $key => $value) {
                $dia_turno[] =[
                    'dia_turno_id' => $request->frequencia_nucleo[$key],
                ];
            }

            $beneficiario->frequenciaBeneficiarios()->delete();
            $beneficiario->frequenciaBeneficiarios()->createMany($dia_turno);
        endif;
    }

    public function desativar(Request $request, Beneficiario $beneficiario)
    {
        try {
            \DB::transaction(function () use ($request, $beneficiario ){
                $beneficiario->ativo=false;
                $beneficiario->save();
                $beneficiario->saveHistorico($request->justificativa);
            });
           return response()->json(['message' => 'Beneficiário inativado com Sucesso.'], 200);
        }
        catch (\Exception $e) {
            Log::error($e->getMessage());
            $msgExtra= $beneficiario->data_ingresso?'':" - Data de Ingresso Nula";
            return response()->json(['error' =>  "Erro ao inativar o Beneficiário!".$msgExtra], 500);
        }
    }

    public function reativar(Beneficiario $beneficiario)
    {
        try {
            $beneficiario->ativo=true;
            $beneficiario->data_ingresso=date('Y-m-d');
            $beneficiario->save();
            return response()->json([
                'message' => 'Beneficiário reativado com Sucesso.'
            ], 200);
        } catch (\Illuminate\Database\QueryException $e) {
            Log::error($e->getMessage());
            return response()->json([
                'error' =>  "Erro ao reativar o Beneficiário!"
            ], 500);
        }
    }

    public function desativarBath(Request $request)
    {
        try{
            \DB::transaction(function () use ($request){
                Beneficiario::whereIn('id',$request->ids)
                ->update(['ativo'=>false]);
                Beneficiario::saveBathHistorico($request->ids, $request->justificativa);
            });
            return response()->json(['message'=>"Beneficiários desativados com sucesso"]);
        }
        catch(\Exception $e){
            Log::error($e->getMessage());
            return response()->json([
                'error' =>  "Erro ao desativar Beneficiários! Verifique se registros possuem Data de Ingresso"
            ], 500);
        }

    }



    public function uploadAvatar(AvatarRequest $request){



        $beneficiario = Beneficiario::findOrFail($request->beneficiario_id);

        if($request->hasFile('file')){

            $pasta_documentos_beneficiarios = "doc_beneficiarios/".$beneficiario->id;

            $file = $request->file;


            $filename  = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $renamed_file_name = 'avatar.'.$extension;

            // Log::info($filename);
            // Log::info($extension);

            $path = $file->storeAs($pasta_documentos_beneficiarios, $renamed_file_name);

            $allFiles = Storage::files($pasta_documentos_beneficiarios);

            $allFiles = str_replace($pasta_documentos_beneficiarios."/", "", $allFiles);//remover o path e deixar somente o nome dos arquivos

            // Log::info($allFiles);

            return response()->json([
                'avatar' => $allFiles,
                'beneficiario'=>$beneficiario]);
        }
    }



    public function getAvatar($beneficiario_id){
        $beneficiario = Beneficiario::findOrFail($beneficiario_id);
        $pasta_documentos_beneficiarios = "doc_beneficiarios/".$beneficiario->id;
        $path = $pasta_documentos_beneficiarios."/avatar.jpg";

          if(Storage::exists($path)):
            $mimeType = Storage::mimeType($pasta_documentos_beneficiarios."/avatar.jpg");
            $headers = [
                'Content-Type'=> $mimeType,
            ];
            return  Storage::download($path, "avatar.jpg", $headers);
        endif;
        return response()->json(['msg'=>"Avatar não encontrado!"],404);

     }


     public function downloadFile($tipo, $cpf, $arquivo)
     {
        //PDF file is stored under project/public/download/info.pdf
        //Log::info("tipo: ", $tipo);
        //Log::info("cpf: ", $cpf);
        $file="doc_beneficiarios/".$cpf."/".$tipo."/".$arquivo;

        $headers = array(
            'Content-Type: application/pdf',
        );

        return Storage::download($file, 'teste2.pdf', $headers);
    }


    public function pjpsUsuario($id)
    {


    }

}




