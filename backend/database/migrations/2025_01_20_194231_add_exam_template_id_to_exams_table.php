<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('exams', function (Blueprint $table) {
            $table->unsignedBigInteger('exam_template_id')->nullable();
            $table->foreign('exam_template_id')->references('id')->on('exam_templates')->onDelete('cascade');
        });
    }
    
    public function down()
    {
        Schema::table('exams', function (Blueprint $table) {
            $table->dropForeign(['exam_template_id']);
            $table->dropColumn('exam_template_id');
        });
    }
    
};
