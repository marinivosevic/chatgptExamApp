<?php
// database/migrations/xxxx_xx_xx_add_points_to_exam_sessions_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPointsToExamSessionsTable11 extends Migration
{
    public function up()
    {
        Schema::table('exam_sessions', function (Blueprint $table) {
            $table->integer('points')->default(0)->after('status');
        });
    }

    public function down()
    {
        Schema::table('exam_sessions', function (Blueprint $table) {
            $table->integer('points')->default(0)->after('status');
        });
    }
}
