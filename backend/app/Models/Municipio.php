<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Municipio extends Model
{
    use HasFactory;

    public function nucleos()
    {
        return $this->hasMany(Nucleo::class);
    }


    public static function getAllByFiltros(){
        $query = self::query();
        $request = request();
        if ($request->uf):
            $query->where('uf', $request->uf);
        endif;
        if ($request->regiao):
            $query->where('regiao', $request->regiao);
        endif;
        if ($request->municipio):
            $query->where('municipio', 'like', "%{$request->municipio}%");
        endif;
       
        return $query->get();
        
    }

    public static function getRegioes(){
        
        $query = self::select('regiao')->orderBy('regiao')->distinct();
        $request = request();
        if ($request->regiao):
            $query->where('regiao', 'like', "%{$request->regiao}%");
        endif;
       
        return $query->pluck('regiao');
        
    }

    public static function getUfs(){
        
        $query = self::select('uf')->orderBy('uf')->distinct();
        $request = request();
        if ($request->regiao):
            $query->where('regiao', $request->regiao);
        endif;
        if ($request->uf):
            $query->where('uf', 'like', "%{$request->uf}%");
        endif;
       
        return $query->pluck('uf');
        
    }
}
