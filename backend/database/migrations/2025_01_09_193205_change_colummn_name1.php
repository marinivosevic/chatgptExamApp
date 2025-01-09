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
        Schema::table('questions', function (Blueprint $table) {
            // Add the new exam_template_id column
           
            
            // Remove the old exam_id column
            $table->dropForeign(['exam_id']); // Drop the foreign key constraint
            $table->dropColumn('exam_id');   // Drop the column itself
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            // Re-add the old exam_id column
            $table->foreignId('exam_id')->nullable()->constrained()->onDelete('cascade');
            
            // Remove the new exam_template_id column
            $table->dropForeign(['exam_template_id']); // Drop the foreign key constraint
            $table->dropColumn('exam_template_id');    // Drop the column itself
        });
    }
};
