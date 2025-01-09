<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('scheduled_exams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->constrained('exam_templates');
            $table->date('date');
            $table->time('time');
            $table->foreignId('course_id')->constrained('courses');
            $table->string('access_code');
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
