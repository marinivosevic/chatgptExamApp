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
            // Add a new start_time column of type TIME
            $table->time('start_time')->nullable()->after('date'); // Adjust the position as needed
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('exams', function (Blueprint $table) {
            // Drop the start_time column if this migration is rolled back
            $table->dropColumn('start_time');
        });
    }
};
