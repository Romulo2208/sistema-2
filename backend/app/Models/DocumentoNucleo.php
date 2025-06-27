<?php

namespace App\Models;

use Auth;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use JWTAuth;
use App\Models\Nucleo;

use Illuminate\Support\Facades\Log;

class DocumentoNucleo extends Model
{
    use HasFactory;

    protected $table = 'documentos_nucleos';

    protected $fillable = [
        'name',
        'path',
        'url',
        'mime_type',
        'size',
        'user_id',
        'nucleo_id',
        'comar_id',
        'status',
        'ativo',
    ];

    public function nucleo()
    {
        return $this->belongsTo(Nucleo::class);
    }

    /**
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */

     public function scopeByUserAndNucleo($query)
    {
        $user = Auth::user();
        $role = $user->userRole();

        if (in_array($role, ['admin', 'coordenador_geral'])) {
            return $query->whereIn('status', [
                'Aprovado Coordenador',
                'Aprovado Coordenador Geral',
                'Rejeitado Coordenador Geral'
            ]);
        }

        $nucleoId = $user->nucleos->first()->id ?? null;
        $comarId = $user->comars()->first()->id ?? null;

        return $query->where(function ($query) use ($nucleoId, $comarId) {
            if ($nucleoId) {
                $query->orWhere('nucleo_id', $nucleoId);
            }
            if ($comarId) {
                $query->orWhere('comar_id', $comarId);
            }
        });
    }
}
