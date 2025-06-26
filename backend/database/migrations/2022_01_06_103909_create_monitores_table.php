<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMonitoresTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('monitors', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('endereco');
            $table->string('cpf')->unique();
            $table->string('email')->unique()->nullable();
            $table->string('telefone');
            $table->string('celular');
            $table->date('data_nascimento');
            $table->string('graduacao');
            $table->integer('nucleo_id');
            $table->foreign('nucleo_id')->references('id')->on('nucleos')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('monitors');
    }
}
