<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DiaTurno;

class DiaTurnoController extends Controller
{
   /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $dia_turno=  DiaTurno::all();
        return response()->json($dia_turno);
      
    }
}
