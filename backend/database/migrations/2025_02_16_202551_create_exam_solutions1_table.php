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
        Schema::create('users_exams_solved', function (Blueprint $table) {
            // Assuming 'exams' and 'users' use bigIncrements for IDs
            $table->unsignedBigInteger('exam_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamp('solved_at')->useCurrent();

            // Composite primary key to ensure uniqueness of exam/user pairs
            $table->primary(['exam_id', 'user_id']);

            // Define foreign keys
            $table->foreign('exam_id')
                ->references('id')->on('exams')
                ->onDelete('cascade');

            $table->foreign('user_id')
                ->references('id')->on('users')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_solutions');
    }
};
