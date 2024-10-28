<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Answers extends Model
{
    use HasFactory;

    protected $fillable = ['id','exam_session_id','question_id','answer','is_correct'];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
