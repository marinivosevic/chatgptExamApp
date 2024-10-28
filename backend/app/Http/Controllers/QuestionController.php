<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\Question;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    public function store(Request $request, Exam $exam)
    {
        $validated = $request->validate([
            'text' => 'required|string',
        ]);

        $question = new Question([
            'text' => $validated['text']
        ]);

        $exam->questions()->save($question);

        return response()->json([
            'message' => 'Question added successfully.',
            'question' => $question
        ], 201);
    }

    public function createExamWithQuestions(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'questions' => 'required|array',
            'questions.*.text' => 'required|string',
            'questions.*.points' => 'required|integer',
            'time' => 'required|integer'
        ]);

        $exam = Exam::create([
            'title' => $validated['title']
        ]);

        foreach ($validated['questions'] as $questionData) {
            $question = new Question([
                'text' => $questionData['text']
            ]);
            $exam->questions()->save($question);
        }

        return response()->json([
            'message' => 'Exam and questions added successfully.',
            'exam' => $exam,
            'questions' => $exam->questions
        ], 201);
    }
}