<?php

namespace App\Models;

use Auth;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use JWTAuth;

use Illuminate\Support\Facades\Log;

class StatusDocumento extends Model
{
    use HasFactory;

    protected $table = 'status_documentos';

    protected $fillable = [
        'documento_id',
        'id_usuario',
        'acao',
        'descricao',
    ];

}
