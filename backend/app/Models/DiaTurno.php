<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiaTurno extends Model
{
    use HasFactory;
    protected $table = 'dia_turnos';
    protected $fillable = ['descricao'];
}
