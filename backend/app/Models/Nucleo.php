<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use JWTAuth;


class Nucleo extends Model
{
    use HasFactory;


    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'descricao',
        'municipio_id',
        'comar_id'
    ];

    protected $hidden = ['pivot'];


    public function municipio()
    {
        return $this->belongsTo(Municipio::class);
    }

    public function comar()
    {
        return $this->belongsTo(Comar::class);
    }

    public function beneficiarios()
    {
        return $this->hasMany(Beneficiario::class);
    }

    public function diaTurnoNucleos()
    {
        return $this->belongsToMany(DiaTurno::class, 'dia_turno_nucleos', 'nucleo_id', 'dia_turno_id');
    }

    
    public function users() {
        return $this->belongsToMany('App\Models\User');
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
        $sort                   = $request->has('_sort') ? $request->get('_sort'):"descricao";
        $order                  = $request->has('_order') ? $request->get('_order'):"asc";

      
        $total= self::count();

        $query=self::join('municipios', 'municipios.id', '=', 'nucleos.municipio_id');
        $query->join('comars', 'comars.id', '=', 'nucleos.comar_id');
        // $query=self::join('comars', 'comars.id', '=', 'nucleos.comar_id');

        $query->select("nucleos.*","municipios.municipio","municipios.uf","municipios.regiao", "comars.id as comar_id","comars.descricao as comar_descricao");

      
        if ($request->descricao_like):
            $query->where(DB::raw('lower(nucleos.descricao)'), 'like', "%".strtolower($request->descricao_like). "%");
        endif;

        if ($request->regiao_like):
            $query->where(DB::raw('lower(municipios.regiao)'), 'like', "%".strtolower($request->regiao_like). "%");
        endif;

        if ($request->municipio_like):
            $query->where(DB::raw('lower(municipios.municipio)'), 'like', "%".strtolower($request->municipio_like). "%");
        endif;

        if ($request->uf_like):
            $query->where(DB::raw('lower(municipios.uf)'),  'like', "%".strtolower($request->uf_like). "%");
        endif;

        if ($request->comar_id_like):
            $query->where('comars.id', (int)$request->comar_id_like);
        endif;

        /**
         * criar a regra para listar de acordo com o perfil do usuarios logado
         * se a role user <= 3 ie. (admin, coodenador geral, gestor_nacional) pode ver tudo
         *  as demais roles sendo > 3 somente listar os núcleos que estiverem IN $comars_user_logger
         * para isso o menor elemento no array de roles que o usuario possui deve ser > 3
         */
        // Log::info($roles_user_logged);

         if($roles_user_logged->min() > 3):
            //$query->whereIn('comars.id', $comars_user_logger);
            //role min 4 vai ser gestor regional e dai o select eh pelos comar_id
            
            if($roles_user_logged->min() == 4):
                $query->whereIn('comar_id', $comars_user_logger);
            elseif($roles_user_logged->min() == 5):
                $query->whereIn('nucleos.id', $nucleos_user_logged);
            endif;

         endif;

        /*
        Futuramente se necessário: cair na condição somenete se data válida recebida e comparar retirando as horas.
        if ($request->created_at_like):
            $query->where('nucleos.created_at',  '=', Carbon::createFromFormat('d/m/Y', $request->created_at_like)->format('Y-m-d'));
        endif;

        if ($request->updated_at_like):
            $query->where('nucleos.updated_at',  '=', Carbon::createFromFormat('d/m/Y', $request->updated_at_like)->format('Y-m-d'));
        endif;
        */

        $total=$query->count();

        $query->with('diaTurnoNucleos');
        
        $query->orderBy($sort, $order);
        $query->limit($limit)->offset(($page - 1) * $limit);
       
        $resposta= new \stdClass();
        $resposta->data=$query->get();
        $resposta->total=$total;
       
        return $resposta;




    }
}
