<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ExamSession;

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
        
}
