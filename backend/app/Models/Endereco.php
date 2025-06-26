<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Endereco extends Model
{
    use HasFactory;

     /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'logradouro',
        'complemento',
        'bairro',
        'localidade',
        'uf',
        'numero',
        'beneficiario_id',
        'cep'
    ];


    public function beneficiario()
    {
        return $this->belongsTo(Beneficiario::class);
    }




}
