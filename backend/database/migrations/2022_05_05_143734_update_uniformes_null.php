<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateUniformesNull extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('uniformes', function (Blueprint $table) {
            
            $table->string ('tamanho_camisa')->nullable()->change();
            $table->string ('tamanho_calca')->nullable()->change();
            $table->string ('tamanho_tenis')->nullable()->change();
            $table->string ('tamanho_abrigo')->nullable()->change();
            $table->string ('tamanho_short')->nullable()->change();
   
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
