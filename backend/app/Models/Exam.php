<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'time', 'course_id', 'date', 'access_code', 'exam_template_id', 'start_time'];

    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
    public function examTemplate()
    {
        return $this->belongsTo(ExamTemplate::class, 'exam_template_id');
    }
}
