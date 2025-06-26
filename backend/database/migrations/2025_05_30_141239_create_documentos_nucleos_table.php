<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDocumentosNucleosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('documentos_nucleos', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('path');
            $table->string('url');
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('size')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('nucleo_id')->nullable();
            $table->unsignedBigInteger('comar_id')->nullable();
            $table->text('status');
            $table->timestamps();


            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('nucleo_id')->references('id')->on('nucleos')->onDelete('set null');
            $table->foreign('comar_id')->references('id')->on('comars')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('documentos_nucleos');
    }
}
