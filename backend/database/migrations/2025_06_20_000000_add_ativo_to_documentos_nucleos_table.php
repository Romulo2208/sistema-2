<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAtivoToDocumentosNucleosTable extends Migration
{
    public function up()
    {
        Schema::table('documentos_nucleos', function (Blueprint $table) {
            $table->boolean('ativo')->default(true);
        });
    }

    public function down()
    {
        Schema::table('documentos_nucleos', function (Blueprint $table) {
            $table->dropColumn('ativo');
        });
    }
}
