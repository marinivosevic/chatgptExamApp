<?php

namespace App\Http\Controllers;

use App\Models\ExamTemplate;
use App\Models\ScheduledExam;
use App\Models\Question;
use Illuminate\Http\Request;

class ExamTemplateController extends Controller
{

    public function createTemplate(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'course_id' => 'required|exists:courses,id',
            'questions' => 'required|array',
            'questions.*.text' => 'required|string',
            'questions.*.points' => 'required|integer',
        ]);

        $template = ExamTemplate::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'course_id' => $validated['course_id'],
        ]);

        foreach ($validated['questions'] as $questionData) {
            $template->questions()->create($questionData);
        }

        return response()->json(['message' => 'Template created successfully', 'template' => $template], 201);
    }

    public function getQuestionsByExamTemplateId($examTemplateId)
    {
        // Retrieve all questions associated with the given exam template ID
        $questions = Question::where('exam_template_id', $examTemplateId)->get();

        if ($questions->isEmpty()) {
            return response()->json(['message' => 'No questions found for this exam template.'], 404);
        }

        return response()->json([
            'exam_template_id' => $examTemplateId,
            'questions' => $questions,
        ], 200);
    }

    public function listTemplates()
    {
        $templates = ExamTemplate::with('questions')->get();
        return response()->json(['templates' => $templates], 200);
    }

    public function getTemplatesInCourse($courseId)
    {
        $templates = ExamTemplate::where('course_id', $courseId)->with('questions')->get();
        return response()->json(['templates' => $templates], 200);
    }

    public function scheduleExam(Request $request)
    {
        $validated = $request->validate([
            'template_id' => 'required|exists:exam_templates,id',
            'date' => 'required|date',
            'time' => 'required',
            'course_id' => 'required|exists:courses,id',
            'access_code' => 'required|string',
        ]);

        $scheduledExam = ScheduledExam::create($validated);

        return response()->json(['message' => 'Exam scheduled successfully', 'exam' => $scheduledExam], 201);
    }

    public function listScheduledExams()
    {
        $exams = ScheduledExam::with('template')->get();
        return response()->json(['exams' => $exams], 200);
    }
}
