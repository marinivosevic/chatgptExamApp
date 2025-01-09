<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;


class ExamTemplate extends Model
{
    protected $fillable = ['title', 'description'];

    public function questions()
    {
        return $this->hasMany(Question::class);
    }
}
