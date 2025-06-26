<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deficiencia extends Model
{
    use HasFactory;

    protected $fillable = [
        'tipo'
    ];
    
    public static function getAllNgSmart()
    {

        $request=request();
        $page                   = $request->has('_page') ? $request->get('_page') : 1;
        $limit                  = $request->has('_limit') ? $request->get('_limit') : 20;
        $sort                   = $request->has('_sort') ? $request->get('_sort'):"id";
        $order                  = $request->has('_order') ? $request->get('_order'):"asc";

        $query=self::query();

       
        if($request->tipo_like):
            $query->where(DB::raw('lower(deficiencias.tipo)'), 'like', "%".strtolower($request->tipo_like). "%");
        endif;

        $total=$query->count();

        $query->orderBy($sort, $order);
        $query->limit($limit)->offset(($page - 1) * $limit);
       
        $resposta= new \stdClass();
        $resposta->data=$query->get();
        $resposta->total=$total;
       
        return $resposta;

    }

    public function beneficiarios()
    {
        return $this->belongsToMany(Beneficiario::class);
    }
}
