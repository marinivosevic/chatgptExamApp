<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ExamSession;
use App\Models\Exam;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
class ExamSessionController extends Controller
{
    
    public function startSession(Request $request){
        $validated = $request->validate([
            'user_id' => 'required|integer',
            'exam_id' => 'required|integer',
           
            
        ]);

        $session = ExamSession::create([
            'user_id' => $validated['user_id'],
            'exam_id' => $validated['exam_id'],
            'started_at' => now(),
            'status' => "inProgress"
        ]);

        return response()->json($session);
    }

    public function endSession(Request $request){
        $validated = $request->validate([
            'user_id' => 'required|integer',
            'exam_id' => 'required|integer',
           
            
        ]);

        $session = ExamSession::where('user_id',$validated['user_id'])->where('exam_id',$validated['exam_id'])->first();
        $session->update([
            'ended_at' => now(),
            'status' => 'finished'
        ]);
       
        //TODO Sending questions to ChatGPT
        $answers = $session->answers()->with('question')->get();

        // Send answers to another API or process as needed
        // For now, return the answers
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
        $students = $examSessions->unique('user_id')->map(function($session) {
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

        $answers = $examSession->answers->map(function($answer) {
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
        if ($authenticatedUser->role !== 'profesor' ) {
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
        
}
