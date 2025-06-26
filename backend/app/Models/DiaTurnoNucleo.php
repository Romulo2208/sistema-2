<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiaTurnoNucleo extends Model
{
    use HasFactory;

    protected $table = 'dia_turno_nucleos';
  
    protected $fillable = [
        'nucleo_id',
        'dia_turno_id',
    ];
}
