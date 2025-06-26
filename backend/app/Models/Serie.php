<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\EtapaEnsino;
use App\Models\Beneficiario;

class Serie extends Model
{
    use HasFactory;

    protected $fillable = ['nome','etapa_ensino_id'];

    public function etapaEnsino()
    {
        return $this->belongsTo(EtapaEnsino::class);
    }

    public function beneficiarios()
    {
        return $this->hasMany(Beneficiario::class);
    }
}
