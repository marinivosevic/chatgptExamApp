<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamSession extends Model
{
    use HasFactory;
    protected $fillable = ['exam_id', 'user_id', 'score', 'status', 'started_at', 'ended_at', 'points'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function answers()
    {
        return $this->hasMany(Answers::class);
    }
    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }
  
}
