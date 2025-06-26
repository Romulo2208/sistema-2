<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDiaTurnoNucleosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('dia_turno_nucleos', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('dia_turno_id')->unsigned();
            $table->bigInteger('nucleo_id')->unsigned();
            $table->timestamps();


            $table->foreign('dia_turno_id')->references('id')->on('dia_turnos');
            $table->foreign('nucleo_id')->references('id')->on('nucleos');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('dia_turno_nucleos');
    }
}
