<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use JWTAuth;

class Monitor extends Model
{
    use HasFactory;

    protected $fillable = [
        "nome",
		"endereco",
		"cpf",
		"email",
		"telefone",
		"celular",
		"data_nascimento",
		"formacao_academica",
		"nucleo_id",
        "funcao",
    ];

    public function nucleo()
    {
        return $this->belongsTo(Nucleo::class);
    }

    public static function getAllNgSmart()
    {

        $user_Logged = JWTAuth::toUser(JWTAuth::getToken());

        $comars_user_logger     = collect($user_Logged->comars)->map(function($e){ return $e->id; });
        $roles_user_logged      = collect($user_Logged->roles)->map(function($e){ return $e->id;});
        $nucleos_user_logged    = collect($user_Logged->nucleos)->map(function($e){ return $e->id;});



        $request=request();
        $page                   = $request->has('_page') ? $request->get('_page') : 1;
        $limit                  = $request->has('_limit') ? $request->get('_limit') : 20;
        $sort                   = $request->has('_sort') ? $request->get('_sort'):"id";
        $order                  = $request->has('_order') ? $request->get('_order'):"desc";
        $ativo                  = $request->has('ativo_like') ? $request->get('ativo_like') : 1;

        

        $query=self::query();
        $query->join('nucleos', 'nucleos.id', '=', 'monitors.nucleo_id');
        $query->join('comars', 'comars.id', '=', 'nucleos.comar_id');

       
        $query->select("monitors.*","nucleos.descricao as nucleo_descricao","comars.descricao as comar_descricao");


        if ($request->nome_like):
            $query->where(\DB::raw('lower(monitors.nome)'), 'like', "%".strtolower($request->nome_like). "%");
        endif;

        if ($request->endereco_like):
            $query->where(\DB::raw('lower(monitors.endereco)'), 'like', "%".strtolower($request->endereco_like). "%");
        endif;

        if ($request->cpf_like):
            $query->where(\DB::raw('lower(monitors.cpf)'), 'like', "%".strtolower($request->cpf_like). "%");
        endif;

        if ($request->celular_like):
            $query->where(\DB::raw('lower(monitors.celular)'), 'like', "%".strtolower($request->celular_like). "%");
        endif;

        if ($request->telefone_like):
            $query->where(\DB::raw('lower(monitors.telefone)'), 'like', "%".strtolower($request->telefone_like). "%");
        endif;

        if ($request->nucleo_like):
            $query->whereHas('nucleo', function ($query) use ($request) {
                $query->where(\DB::raw('lower(descricao)'), 'like', "%".strtolower($request->nucleo_like). "%");
            });
        endif;

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
                $query->whereIn('monitors.nucleo_id', $nucleos_user_logged);
            endif;

        endif;







        $total=$query->count();

        $query->with('nucleo');

        $query->orderBy($sort, $order);
        $query->limit($limit)->offset(($page - 1) * $limit);

        $resposta= new \stdClass();
        $resposta->data=$query->get();
        $resposta->total=$total;

        return $resposta;

    }
}
