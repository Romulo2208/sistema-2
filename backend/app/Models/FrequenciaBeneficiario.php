<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FrequenciaBeneficiario extends Model
{
    use HasFactory;

    protected $table = 'frequencia_beneficiarios';

    protected $fillable = [
        'beneficiario_id',
        'dia_turno_id',
    ];


    // public function beneficiario()
    // {
    // 	return $this->belongsTo(Beneficiario::class);
    // }

    public function turno()
    {
    	return $this->belongsTo(DiaTurno::class, 'dia_turno_id');
    }
}
