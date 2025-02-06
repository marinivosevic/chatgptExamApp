<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamTemplate extends Model
{
    protected $fillable = ['title', 'description', 'course_id'];

    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function exams()
    {
        return $this->hasMany(Exam::class, 'exam_template_id');
    }
}
