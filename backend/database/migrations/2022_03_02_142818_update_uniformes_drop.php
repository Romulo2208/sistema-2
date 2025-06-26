<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateUniformesDrop extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

            Schema::table('uniformes', function($table) {
                $table->dropColumn(['tamanho_bone', 'tamanho_meia']);
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
        Schema::table('uniformes', function($table) {
            $table->integer('tamanho_bone')->nullable();   
            $table->integer('tamanho_meia')->nullable();   
        });
    }
}
