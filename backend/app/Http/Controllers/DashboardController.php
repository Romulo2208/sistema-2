<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Dashboard;

class DashboardController extends Controller
{
    public function index()
    {

        $map=Dashboard::getBeneficiariosMapQtd();
        return response()->json($map);

    }

    public function getBeneficiariosByAccess()
    {
        $map = Dashboard::getBeneficiariosMapQtdByAccess();
        return response()->json($map);
    }


    public function getNucleosMapQtd()
    {

        $map=Dashboard::getNucleosMapQtd();
        return response()->json($map);

    }

}
