<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateRelacionamentoNucleoDiaTurno extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
    
        Schema::table('dia_turno_nucleos', function (Blueprint $table) {

            $table->dropForeign(['dia_turno_id']);
            $table->dropForeign(['nucleo_id']);


            $table->foreign('dia_turno_id')->references('id')->on('dia_turnos')->onDelete('cascade');
            $table->foreign('nucleo_id')->references('id')->on('nucleos')->onDelete('cascade');
            
        }); 

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
