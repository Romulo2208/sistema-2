<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Uniforme extends Model
{
    use HasFactory;


     /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'tamanho_camisa',
        'tamanho_calca',
        'tamanho_tenis',
        'tamanho_abrigo',
        'tamanho_short',
        'beneficiario_id',
    ];

    public function beneficiario(){
        return $this->belongsTo(Beneficiario::class);
    }
}
