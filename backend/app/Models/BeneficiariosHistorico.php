<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BeneficiariosHistorico extends Model
{
    use HasFactory;

   /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'beneficiario_id',
        'inicio_ingresso',
        'termino_ingresso',
        'justificativa'
    ];



}
