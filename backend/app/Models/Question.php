<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;
    protected $fillable = ['text', 'exam_template_id', 'points'];

    public function exam()
    {
        return $this->belongsTo(ExamTemplate::class);
    }
}
