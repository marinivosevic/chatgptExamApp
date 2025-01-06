<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class CourseController extends Controller
{
    /**
     * Display a listing of the courses.
     */

    public function index()
    {
        $authenticatedUser = Auth::user();
        if ($authenticatedUser->role !== 'superAdmin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $courses = Course::all();
        return response()->json($courses);
    }

    /**
     * Store a newly created course in storage.
     */
    public function store(Request $request)
    {

        $authenticatedUser = Auth::user();
        if ($authenticatedUser->role !== 'superAdmin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $request->validate([
            'name' => 'required|string|max:255',
            'course_manager_id' => 'required',
            // Add other validation rules as needed
        ]);

        $course = Course::create([
            'name' => $request->name,
            'course_manager_id' => $request->course_manager_id, // Mozda promijenimo da se na backu traži course_manager_id
            // Add other fields as needed
        ]);

        return response()->json($course, 201);
    }

    /**
     * Display the specified course.
     */
    public function show($id)
    {
        $course = Course::find($id);

        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        return response()->json($course);
    }

    /**
     * Update the specified course in storage.
     */
    public function update(Request $request, $id)
    {
        $course = Course::find($id);

        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            // Add other validation rules as needed
        ]);

        $course->update($request->only(['name']));
        // Update other fields as needed

        return response()->json($course);
    }

    /**
     * Remove the specified course from storage.
     */
    public function destroy($id)
    {
        $course = Course::find($id);

        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        $course->delete();

        return response()->json(['message' => 'Course deleted successfully']);
    }

    /**
     * Add a user to the specified course.
     */

    public function addUserToCourse(Request $request)
    {

        $request->validate([
            'course_id' => 'required|integer',
            'user_id' => 'required|integer',
        ]);

        $course = Course::find($request->course_id);
        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        $user = User::find($request->user_id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $course->users()->attach($user->id);

        return response()->json(['message' => 'User added to course successfully']);
    }

    public function getAllUsersCourses($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $courses = $user->courses;
        return response()->json($courses);
    }
}
