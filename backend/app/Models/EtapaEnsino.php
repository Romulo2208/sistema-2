<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Serie;

class EtapaEnsino extends Model
{
    use HasFactory;

    protected $fillable = ['nome'];

    public function series()
    {
        return $this->hasMany(Serie::class);
    }
}
