<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateUniformesTypes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('uniformes', function (Blueprint $table) {
            $table->string ('tamanho_camisa')->change();
            $table->string ('tamanho_calca')->change();
            $table->string ('tamanho_tenis')->change();
            $table->string ('tamanho_abrigo')->change();
            $table->string ('tamanho_short')->change();

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
