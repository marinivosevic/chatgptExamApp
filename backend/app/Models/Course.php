<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'course_manager_id', // Updated field name
    ];

    /**
     * The users that belong to the course.
     */
    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    /**
     * Get the exams for the course.
     */
    public function exams()
    {
        return $this->hasMany(Exam::class);
    }

    /**
     * Get the course manager.
     */
    public function courseManager()
    {
        return $this->belongsTo(User::class, 'course_manager_id');
    }
}