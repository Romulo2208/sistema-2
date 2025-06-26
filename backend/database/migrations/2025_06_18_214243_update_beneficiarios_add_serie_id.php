<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateBeneficiariosAddSerieId extends Migration
{
    public function up()
    {
        Schema::table('beneficiarios', function (Blueprint $table) {
            if (Schema::hasColumn('beneficiarios','serie_ano')) {
                $table->dropColumn('serie_ano');
            }
            $table->unsignedBigInteger('serie_id')->nullable();
            $table->foreign('serie_id')->references('id')->on('series');
        });
    }

    public function down()
    {
        Schema::table('beneficiarios', function (Blueprint $table) {
            $table->dropForeign(['serie_id']);
            $table->dropColumn('serie_id');
            $table->string('serie_ano')->nullable();
        });
    }
}
