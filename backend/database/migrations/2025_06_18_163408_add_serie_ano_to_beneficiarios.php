<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSerieAnoToBeneficiarios extends Migration
{
    public function up()
    {
        Schema::table('beneficiarios', function (Blueprint $table) {
            $table->string('serie_ano')->nullable();
        });
    }

    public function down()
    {
        Schema::table('beneficiarios', function (Blueprint $table) {
            $table->dropColumn('serie_ano');
        });
    }
}
