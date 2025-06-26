<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DB;
use JWTAuth;
use App\Models\BeneficiariosHistorico;
use App\Models\Serie;

use Illuminate\Support\Facades\Log;

class Beneficiario extends Model
{
    use HasFactory;

     /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'nome_completo',
        'cpf',
        'data_nascimento',
        'nome_pai',
        'nome_mae',
        'nome_responsavel',
        'telefone',
        'celular',
        'email',
        'nucleo_id',
        'escola_id',
        'serie_id',
        'grau_parentesco_responsavel',
        'data_ingresso'
    ];

    public function setNomeCompletoAttribute($value)
    {
        $this->attributes['nome_completo'] = strtoupper($value);
    }

    public function setNomeResponsavelAttribute($value)
    {
        $this->attributes['nome_responsavel'] = strtoupper($value);
    }

    public function setNomePaiAttribute($value)
    {
        $this->attributes['nome_pai'] = strtoupper($value);
    }

    public function setNomeMaeAttribute($value)
    {
        $this->attributes['nome_mae'] = strtoupper($value);
    }

    public function deficiencias()
    {
        return $this->belongsToMany(Deficiencia::class);
    }

    public function nucleo()
    {
        return $this->belongsTo(Nucleo::class);
    }

    public function endereco()
    {
        return $this->hasOne(Endereco::class);
    }

    public function escola()
    {
        return $this->hasOne(Escola::class, 'id', 'escola_id');
    }

    public function serie()
    {
        return $this->belongsTo(Serie::class);
    }

    public function uniforme(){
        return $this->hasOne(Uniforme::class);
    }


    public function frequenciaBeneficiarios(){
        return $this->hasMany(FrequenciaBeneficiario::class);
    }

    public function historicos(){
        return $this->hasMany(BeneficiariosHistorico::class);
    }


    public static function getAllNgSmart()
    {

        $user_Logged = JWTAuth::toUser(JWTAuth::getToken());

        $comars_user_logger     = collect($user_Logged->comars)->map(function($e){ return $e->id; });
        $roles_user_logged      = collect($user_Logged->roles)->map(function($e){ return $e->id;});
        $nucleos_user_logged    = collect($user_Logged->nucleos)->map(function($e){ return $e->id;});

        // Log::info("comars: ".$comars_user_logger);
        // Log::info("Roles: ".$roles_user_logged);
        // Log::info("Núcleos: ".$nucleos_user_logged);

        $request=request();
        $page                   = $request->has('_page') ? $request->get('_page') : 1;
        $limit                  = $request->has('_limit') ? $request->get('_limit') : 20;
        $sort                   = $request->has('_sort') ? $request->get('_sort'):"id";
        $order                  = $request->has('_order') ? $request->get('_order'):"desc";
        $ativo                  = $request->has('ativo_like') ? $request->get('ativo_like') : 1;

        $query=self::query();

        //subquery para contar as deficiencias
        $countDeficiencias = DB::table('beneficiario_deficiencia')
                            ->select('beneficiario_id', DB::raw('COUNT(*) as pjp'))
                            ->groupBy('beneficiario_id');
        //fim da subquery
        $query->join('nucleos', 'nucleos.id', '=', 'beneficiarios.nucleo_id');
        $query->join('municipios', 'municipios.id', '=', 'nucleos.municipio_id');
        $query->join('comars', 'comars.id', '=', 'nucleos.comar_id');
        $query->join('escolas', 'escolas.id', '=', 'beneficiarios.escola_id');

        //join com subquery
        $query->leftJoinSub($countDeficiencias, 'pjps', function ($join) {
            $join->on('beneficiarios.id', '=', 'pjps.beneficiario_id');
        });

        //fim join com subquery
        $query->select("beneficiarios.*", "nucleos.descricao as nucleo_descricao", "municipios.municipio","municipios.uf","municipios.regiao","comars.id as comar_id","comars.descricao as comar_descricao","pjps.pjp", "escolas.nome as escola_nome");
        $query->where('ativo',$ativo);

        if ($request->nome_completo_like):
            $query->where(DB::raw('lower(beneficiarios.nome_completo)'), 'like', "%".strtolower($request->nome_completo_like). "%");
        endif;

        if ($request->data_nascimento_like):
            $query->where(DB::raw('lower(beneficiarios.data_nascimento)'), 'like', "%".strtolower($request->data_nascimento_like). "%");
        endif;

        if ($request->nome_mae_like):
            $query->where(DB::raw('lower(beneficiarios.nome_mae)'), 'like', "%".strtolower($request->nome_mae_like). "%");
        endif;

        if ($request->nome_pai_like):
            $query->where(DB::raw('lower(beneficiarios.nome_pai)'), 'like', "%".strtolower($request->nome_pai_like). "%");
        endif;

        if ($request->nome_responsavel_like):
            $query->where(DB::raw('lower(beneficiarios.nome_responsavel)'), 'like', "%".strtolower($request->nome_responsavel_like). "%");
        endif;

        if ($request->cpf_like):
            $query->where(DB::raw('lower(beneficiarios.cpf)'), 'like', "%".strtolower($request->cpf_like). "%");
        endif;

        if ($request->grau_parentesco_responsavel_like):
            $query->where(DB::raw('lower(beneficiarios.grau_parentesco_responsavel)'), 'like', "%".strtolower($request->grau_parentesco_responsavel_like). "%");
        endif;

        if ($request->nucleo_descricao_like):
            $query->where(DB::raw('lower(nucleos.descricao)'), 'like', "%".strtolower($request->nucleo_descricao_like). "%");
        endif;

        if ($request->regiao_like):
            $query->where(DB::raw('lower(municipios.regiao)'), 'like', "%".strtolower($request->regiao_like). "%");
        endif;

        if ($request->comar_id_like):
            $query->where(DB::raw('(comars.id)'), '=', strtolower($request->comar_id_like));
        endif;

        if ($request->comar_descricao_like):
            $query->where(DB::raw('lower(comars.descricao)'), 'like', "%".strtolower($request->comar_descricao_like). "%");
        endif;

        if ($request->municipio_like):
            $query->where(DB::raw('lower(municipios.municipio)'), 'like', "%".strtolower($request->municipio_like). "%");
        endif;

        if ($request->uf_like):
            $query->where(DB::raw('lower(municipios.uf)'),  'like', "%".strtolower($request->uf_like). "%");
        endif;

        if ($request->justificativa_like):
            $query->where(DB::raw('lower(beneficiarios.justificativa)'),  'like', "%".strtolower($request->justificativa_like). "%");
        endif;

        if (is_numeric($request->pjp_like)):
            $tipoWherePjp=$request->pjp_like?'whereNotNull':'whereNull';
            $query->$tipoWherePjp('pjps.pjp');
        endif;

        if ($request->escola_nome_like):
            $query->where(DB::raw('lower(escolas.nome)'),  'like', "%".strtolower($request->escola_nome_like). "%");
        endif;

        if ($request->turno_like):
            $turnos_ids = explode(',', $request->turno_like);
            $query->whereHas('frequenciaBeneficiarios', function ($query) use ($turnos_ids) {
                $query->whereIn('dia_turno_id', $turnos_ids);
            });
        endif;

        // neque        Gestor Nacional
        // officiis     Gestor Regional
        // rerum        Coordenador de Núcleo

        /**
         * criar a regra para listar os beneficiários de acordo com o perfil do usuarios logado
         * se a role user <= 3 (admin, coodenador geral, gestor_nacional) pode ver tudo
         *  as demais roles sendo > 3 somente listar os núcleos que estiverem IN $comars_user_logger
         * para isso o menor elemento no array de roles que o usuario possui deve ser > 3
         */
        if($roles_user_logged->min() > 3):

            //role min 4 vai ser gestor regional e dai o select eh pelos comar_id
             if($roles_user_logged->min() == 4):
                $query->whereIn('comar_id', $comars_user_logger);
             elseif($roles_user_logged->min() == 5):
                $query->whereIn('beneficiarios.nucleo_id', $nucleos_user_logged);
            endif;

        endif;


        $total=$query->count();

        $query->with('frequenciaBeneficiarios.turno');

        $query->orderBy($sort, $order);
        $query->limit($limit)->offset(($page - 1) * $limit);

        $resposta= new \stdClass();
        $resposta->data=$query->get();
        $resposta->total=$total;

        return $resposta;

    }


    /**
     * Método que retorna um beneficiário com relacionamento sem aninhamento nucleo/municipio.
     */
    public static function retirarAninhamentoNucleoMunicipio($beneficiarioArray)
    {
        if($beneficiarioArray):
            $beneficiarioArray['nucleo']['regiao']= $beneficiarioArray['nucleo']['municipio']['regiao'];
            $beneficiarioArray['nucleo']['uf']= $beneficiarioArray['nucleo']['municipio']['uf'];
            $beneficiarioArray['nucleo']['municipio']= $beneficiarioArray['nucleo']['municipio']['municipio'];
            return $beneficiarioArray;
        endif;

    }

    public function saveHistorico($justificativa)
    {
        $dados=[
            "inicio_ingresso"=>$this->data_ingresso,
            "termino_ingresso"=> date('Y-m-d'),
            "justificativa"=>$justificativa
        ];

        $this->historicos()->create($dados);
    }

    public static function saveBathHistorico($ids, $justificativa)
    {
        $beneficiarios = Beneficiario::whereIn('id', $ids)->get();
        $data= $beneficiarios->map(function($beneficiario) use ($justificativa){
            return  [
                'beneficiario_id' => $beneficiario->id,
                'inicio_ingresso' => $beneficiario->data_ingresso,
                'termino_ingresso'=>date('Y-m-d'),
                'justificativa'=>$justificativa,
                'created_at'=>date('Y-m-d H:i:s'),
                'updated_at'=>date('Y-m-d H:i:s'),
            ];
        });
        return BeneficiariosHistorico::insert($data->toArray());

    }



}
