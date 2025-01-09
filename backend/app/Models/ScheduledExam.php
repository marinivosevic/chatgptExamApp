<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;


class ScheduledExam extends Model
{
    protected $fillable = ['template_id', 'date', 'time', 'course_id', 'access_code'];

    public function template()
    {
        return $this->belongsTo(ExamTemplate::class, 'template_id');
    }
}
