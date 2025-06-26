<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSeriesTable extends Migration
{
    public function up()
    {
        Schema::create('series', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('etapa_ensino_id');
            $table->string('nome');
            $table->timestamps();

            $table->foreign('etapa_ensino_id')->references('id')->on('etapas_ensino');
        });
    }

    public function down()
    {
        Schema::dropIfExists('series');
    }
}
