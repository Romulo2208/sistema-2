<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFrequenciaBeneficiariosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('frequencia_beneficiarios', function (Blueprint $table) {
            $table->id();

            $table->bigInteger('beneficiario_id')->unsigned();
            $table->bigInteger('dia_turno_id')->unsigned();

            $table->timestamps();

            $table->foreign('dia_turno_id')->references('id')->on('dia_turnos');
            $table->foreign('beneficiario_id')->references('id')->on('beneficiarios');
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('frequencia_beneficiarios');
    }
}
