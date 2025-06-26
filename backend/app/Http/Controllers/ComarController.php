<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comar;

class ComarController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Comar::all();
    }

    public function show(Request $request, $id)
    {
        return response()->json(Comar::find($id));
    }
}
