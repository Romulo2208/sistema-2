<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use DB;
use JWTAuth;


class Dashboard extends Model
{

    public static function getBeneficiariosMapQtd()
    {
        $queryNotPjp=DB::query()->selectRaw("descricao, COUNT(*) as total")->fromSub(function ($query) {
            $query->from('beneficiarios')
            ->selectRaw("nome_completo, comars.descricao, COUNT(beneficiario_id) as deficiencias")
            ->leftJoin("beneficiario_deficiencia","beneficiarios.id","=","beneficiario_deficiencia.beneficiario_id")
            ->join("nucleos","beneficiarios.nucleo_id","=","nucleos.id")
            ->join("comars","nucleos.comar_id","=","comars.id")
            ->where('ativo',true)
            ->groupBy("nome_completo","comars.descricao")
            ->havingRaw('COUNT(beneficiario_id) = ?', [0]);
        }, 'a')->groupBy("descricao");


        $queryPjp=DB::query()->selectRaw("descricao, COUNT(*) as total")->fromSub(function ($query) {
            $query->from('beneficiarios')
            ->selectRaw("nome_completo, comars.descricao, COUNT(beneficiario_id) as deficiencias")
            ->leftJoin("beneficiario_deficiencia","beneficiarios.id","=","beneficiario_deficiencia.beneficiario_id")
            ->join("nucleos","beneficiarios.nucleo_id","=","nucleos.id")
            ->join("comars","nucleos.comar_id","=","comars.id")
            ->where('ativo',true)
            ->groupBy("nome_completo","comars.descricao")
            ->havingRaw('COUNT(beneficiario_id) > ?', [0]);
        }, 'a')->groupBy("descricao");


        $listNotPjp=$queryNotPjp->pluck('total','descricao');
        $listPjp=$queryPjp->pluck('total','descricao');

        $output=self::outPutBeneficiariosMapQtd($listNotPjp,$listPjp);
        return $output;

    }


    private static function outPutBeneficiariosMapQtd($listNotPjp, $listPjp)
    {

        $comars=['I COMAR', 'II COMAR', 'III COMAR', 'IV COMAR', 'V COMAR','VI COMAR', 'VII COMAR'];
        $multi=[];
        $single=[];


        foreach($comars as $comar){
            $obj= new \stdClass();
            $obj->name=$comar;
            $series=[];
            $notPjp= new \stdClass();
            $notPjp->name="Beneficiarios";
            $notPjp->value=isset($listNotPjp[$comar])?$listNotPjp[$comar]:0;

            $pjp= new \stdClass();
            $pjp->name="Beneficiarios PJP";
            $pjp->value=isset($listPjp[$comar])?$listPjp[$comar]:0;

            $series[]=$notPjp;
            $series[]=$pjp;

            $obj->series=$series;
            $multi[]=$obj;
        }

        $i1=new \stdClass();
        $i1->name="Beneficiários";
        $i1->value=$listNotPjp->sum();

        $i2= new \stdClass();
        $i2->name="Beneficiários PJP";
        $i2->value= $listPjp->sum();
        $single[]=$i1;
        $single[]=$i2;

        $output=new \stdClass();
        $output->single=$single;
        $output->multi=$multi;
        return $output;

    }


    public static function getNucleosMapQtd()
    {
        $listNucleos=DB::table("nucleos")
        ->selectRaw("comars.descricao, COUNT(*) as total")
        ->join("comars","nucleos.comar_id","=","comars.id")
        ->groupBy("comars.descricao")->pluck('total','descricao');
        return self::outputNucleosMapQtd($listNucleos);
    }

    private static function outputNucleosMapQtd($listNucleos)
    {
        $single=[];
        $comars=['I COMAR', 'II COMAR', 'III COMAR', 'IV COMAR', 'V COMAR','VI COMAR', 'VII COMAR'];
        foreach($comars as $comar){
            $obj= new \stdClass();
            $obj->name=$comar;
            $obj->value=isset($listNucleos[$comar])?$listNucleos[$comar]:0;
            $single[]=$obj;
        }
        return $single;
    }

    public static function getBeneficiariosMapQtdByAccess()
    {
        $user = JWTAuth::toUser(JWTAuth::getToken());
        $comars_user_logger  = collect($user->comars)->map(function ($e) { return $e->id; });
        $nucleos_user_logged = collect($user->nucleos)->map(function ($e) { return $e->id; });
        $roles_user_logged   = collect($user->roles)->map(function ($e) { return $e->id; });

        $base = DB::table('beneficiarios')
            ->leftJoin('beneficiario_deficiencia', 'beneficiarios.id', '=', 'beneficiario_deficiencia.beneficiario_id')
            ->join('nucleos', 'beneficiarios.nucleo_id', '=', 'nucleos.id')
            ->join('comars', 'nucleos.comar_id', '=', 'comars.id')
            ->where('ativo', true)
            ->select('beneficiarios.id', 'comars.descricao', DB::raw('COUNT(beneficiario_deficiencia.beneficiario_id) as deficiencias'))
            ->groupBy('beneficiarios.id', 'comars.descricao');

        if ($roles_user_logged->min() > 3) {
            if ($roles_user_logged->min() == 4) {
                $base->whereIn('comars.id', $comars_user_logger);
            } elseif ($roles_user_logged->min() == 5) {
                $base->whereIn('nucleos.id', $nucleos_user_logged);
            }
        }

        $queryNotPjp = DB::query()->selectRaw('descricao, COUNT(*) as total')
            ->fromSub($base, 'a')
            ->where('deficiencias', 0)
            ->groupBy('descricao');

        $queryPjp = DB::query()->selectRaw('descricao, COUNT(*) as total')
            ->fromSub($base, 'a')
            ->where('deficiencias', '>', 0)
            ->groupBy('descricao');

        $listNotPjp = $queryNotPjp->pluck('total', 'descricao');
        $listPjp    = $queryPjp->pluck('total', 'descricao');

        return self::outPutBeneficiariosMapQtd($listNotPjp, $listPjp);
    }


}
