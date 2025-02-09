<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ExamSession;
use App\Models\Exam;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\ScheduledExam;

class ExamSessionController extends Controller
{

    public function startSession(Request $request)
    {
        try {
            // 1. Validate request
            $validated = $request->validate([
                'user_id' => 'required|integer|exists:users,id',
                'exam_id' => 'required|integer|exists:exams,id',
            ]);

            // 2. Create session
            $session = ExamSession::create([
                'user_id' => $validated['user_id'],
                'exam_id' => $validated['exam_id'],
                'started_at' => now(),
                'status' => 'inProgress',
            ]);

            if (!$session) {
                Log::error('Failed to create exam session');
                return response()->json(['message' => 'Failed to create session'], 500);
            }

            // 3. Get exam with template and questions
            // 3. Get exam with template and questions
            $exam = Exam::with(['examTemplate.questions' => function ($query) {
                $query->select('id', 'text', 'exam_template_id');
            }])->findOrFail($validated['exam_id']);

            if (!$exam->examTemplate) {
                Log::error('Exam template not found for exam: ' . $exam->id);
                return response()->json(['message' => 'Exam template not found'], 404);
            }

            $questions = $exam->examTemplate->questions;

            if ($questions->isEmpty()) {
                Log::error('No questions found for template: ' . $exam->template->id);
                return response()->json(['message' => 'No questions found for this exam'], 404);
            }

            // 4. Return success response
            return response()->json([
                'session' => [
                    'id' => $session->id,
                    'user_id' => $session->user_id,
                    'exam_id' => $session->exam_id,
                    'started_at' => $session->started_at,
                    'status' => $session->status,
                    'time' => $exam->time,
                ],
                'questions' => $questions->map(function ($question) {
                    return [
                        'id' => $question->id,
                        'text' => $question->text
                    ];
                })
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error in startSession: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getSessionQuestions($sessionId)
    {
        $session = ExamSession::find($sessionId);
        if (!$session) {
            return response()->json(['message' => 'Session not found'], 404);
        }

        $questions = $session->exam->template->questions;

        return response()->json([
            'session' => $session,
            'questions' => $questions,
        ], 200);
    }



    public function endSession(Request $request)
    {
        // Log the incoming request for debugging
        Log::info('End Session Request:', $request->all());

        // Validate the incoming data
        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'exam_id' => 'required|integer|exists:exams,id',
        ]);

        // Log the validated data
        Log::info('Validated data:', $validated);

        // Find the session based on the user_id and exam_id
        $session = ExamSession::where('user_id', $validated['user_id'])
            ->where('exam_id', $validated['exam_id'])
            ->first();

        // Log the session data
        if ($session) {
            Log::info('Session found:', $session->toArray());
        } else {
            Log::warning('Session not found for user_id: ' . $validated['user_id'] . ' and exam_id: ' . $validated['exam_id']);
        }

        // If no session is found, return an error
        if (!$session) {
            return response()->json(['error' => 'Session not found'], 404);
        }

        // Update the session status and set the 'ended_at' field
        $session->update([
            'ended_at' => now(),
            'status' => 'finished',
        ]);

        // Log after the update
        Log::info('Session updated:', $session->toArray());

        // Fetch the answers associated with the session
        $answers = $session->answers()->with('question')->get();

        // Log the answers
        Log::info('Session answers:', $answers->toArray());

        // Return the answers in the response
        return response()->json(['answers' => $answers], 200);
    }

    public function getStudentsForExam($id)
    {
        // Verify that the exam exists
        $exam = Exam::find($id);
        if (!$exam) {
            return response()->json(['message' => 'Exam not found'], 404);
        }

        // Retrieve all exam sessions for the exam, eager load the user
        $examSessions = ExamSession::where('exam_id', $id)
            ->with('user')
            ->get();

        // Map to unique students to prevent duplicates
        $students = $examSessions->unique('user_id')->map(function ($session) {
            return [
                'user_id' => $session->user->id,
                'name' => $session->user->name,
                'email' => $session->user->email,
                'points' => $session->points,
            ];
        });

        return response()->json(['students' => $students], 200);
    }


    /**
     * Get a specific student's answers and points for an exam.
     */
    public function getStudentDetails(Exam $exam, User $user)
    {
        $authenticatedUser = Auth::user();
        if ($authenticatedUser->role !== 'profesor') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $examSession = ExamSession::where('exam_id', $exam->id)
            ->where('user_id', $user->id)
            ->with(['answers.question'])
            ->first();

        if (!$examSession) {
            return response()->json(['message' => 'Exam session not found for this student'], 404);
        }

        $answers = $examSession->answers->map(function ($answer) {
            return [
                'question_id' => $answer->question->id,
                'question' => $answer->question->text,
                'points_possible' => $answer->question->points,
                'answer' => $answer->answer,
                'points_awarded' => $answer->points_awarded, // Ensure this field exists
            ];
        });

        return response()->json([
            'student' => [
                'user_id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'total_points' => $examSession->points,
            ],
            'answers' => $answers,
        ], 200);
    }


    /**
     * Update a student's points for an exam.
     */
    public function updateStudentPoints(Request $request, Exam $exam, User $user)
    {
        $authenticatedUser = Auth::user();
        if ($authenticatedUser->role !== 'profesor') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $validated = $request->validate([
            'points' => 'required|integer|min:0',
        ]);

        $examSession = ExamSession::where('exam_id', $exam->id)
            ->where('user_id', $user->id)
            ->first();

        if (!$examSession) {
            return response()->json(['message' => 'Exam session not found for this student'], 404);
        }

        $examSession->points = $validated['points'];
        $examSession->save();

        return response()->json(['message' => 'Points updated successfully', 'points' => $examSession->points], 200);
    }

    public function validateAccessCode(Request $request)
    {
        $validated = $request->validate([
            'access_code' => 'required|string',
            'exam_id' => 'required|integer|exists:exams,id',
        ]);

        $exam = Exam::find($validated['exam_id']);
        if (!$exam) {
            return response()->json(['message' => 'Exam not found'], 404);
        }

        if ($exam->access_code !== $validated['access_code']) {
            return response()->json(['message' => 'Invalid access code', 'isValid' => false], 403);
        }

        return response()->json(['message' => 'Access code is valid', 'isValid' => true], 200);
    }
}
