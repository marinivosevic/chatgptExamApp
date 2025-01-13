<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('exam_templates', function (Blueprint $table) {
            if (!Schema::hasColumn('exam_templates', 'course_id')) {
                $table->unsignedBigInteger('course_id')->nullable(); // Add course_id column
            }
        });

        // Set a default course_id for existing rows in exam_templates
        DB::table('exam_templates')
            ->whereNull('course_id')
            ->update([
                'course_id' => DB::table('courses')->first()->id ?? null // Ensure at least one course exists
            ]);

        // Ensure no NULL course_id values remain
        if (DB::table('exam_templates')->whereNull('course_id')->exists()) {
            throw new \Exception('Cannot add foreign key: some rows in exam_templates have NULL course_id and no valid courses exist.');
        }

        Schema::table('exam_templates', function (Blueprint $table) {
            $table->foreign('course_id')
                ->references('id')
                ->on('courses')
                ->onDelete('cascade'); // Add foreign key constraint
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('exam_templates', function (Blueprint $table) {
            $table->dropForeign(['course_id']); // Drop foreign key
            $table->dropColumn('course_id'); // Drop course_id column
        });
    }
};
