<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DB;

class Escola extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
       'localidade',
        'pais',
        'regiao',
        'uf',
        'municipio',
        'categoria_zona',
        'categoria_tipo',
    ];


    public function beneficiario()
    {
        return $this->belongsTo(Beneficiario::class);
    }


    public static function getAllNgSmart()
    {
        $request=request();
        $page                   = $request->has('_page') ? $request->get('_page') : 1;
        $limit                  = $request->has('_limit') ? $request->get('_limit') : 20;
        $sort                   = $request->has('_sort') ? $request->get('_sort'):"id";
        $order                  = $request->has('_order') ? $request->get('_order'):"desc";
        $query=self::query();

        if ($request->nome_like):
            $query->where(DB::raw('lower(escolas.nome)'), 'like', "%".strtolower($request->nome_like). "%");
        endif;

        $total=$query->count();

        $query->orderBy($sort, $order);
        $query->limit($limit)->offset(($page - 1) * $limit);

        $resposta= new \stdClass();
        $resposta->data=$query->get();
        $resposta->total=$total;

        return $resposta;

    }



}
