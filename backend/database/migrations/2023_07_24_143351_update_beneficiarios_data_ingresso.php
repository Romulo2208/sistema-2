<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateBeneficiariosDataIngresso extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('beneficiarios', function (Blueprint $table) {
            $table->date('data_ingresso')->after('ativo')->comment('Data de Ingresso no Ciclo Atual')->nullable();
            $table->dropColumn('justificativa');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('beneficiarios', function (Blueprint $table) {
            $table->dropColumn('data_ingresso');
            $table->string('justificativa')->nullable(); 
        });
    }
}
