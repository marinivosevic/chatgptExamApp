<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The courses that the user is enrolled in.
     */
    public function courses()
    {
        return $this->belongsToMany(Course::class);
    }

    /**
     * The courses that the user manages.
     */
    public function managedCourses()
    {
        return $this->hasMany(Course::class, 'course_manager_id');
    }

    public function solvedExams()
    {
        return $this->belongsToMany(Exam::class, 'users_exams_solved')
            ->withPivot('solved_at');
    }
}
