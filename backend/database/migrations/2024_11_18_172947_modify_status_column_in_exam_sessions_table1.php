<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyStatusColumnInExamSessionsTable1 extends Migration
{
    public function up()
    {
        Schema::table('exam_sessions', function (Blueprint $table) {
            $table->string('status', 20)->change();
        });
    }

    public function down()
    {
        Schema::table('exam_sessions', function (Blueprint $table) {
            $table->string('status', 10)->change();
        });
    }
}
