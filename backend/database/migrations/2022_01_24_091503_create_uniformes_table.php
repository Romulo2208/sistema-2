<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUniformesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('uniformes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('beneficiario_id');
            
            $table->bigInteger ('tamanho_camisa');
            $table->bigInteger ('tamanho_calca');
            $table->bigInteger ('tamanho_tenis');
            $table->bigInteger ('tamanho_abrigo');
            $table->bigInteger ('tamanho_short');
            $table->bigInteger ('tamanho_bone')->nullable();   
            $table->bigInteger ('tamanho_meia')->nullable();   

            $table->timestamps();

            $table->foreign('beneficiario_id')->references('id')->on('beneficiarios')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('uniformes');
    }
}
