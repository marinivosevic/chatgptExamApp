"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Added usePathname
import { examService } from "@/app/api/examService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Question } from "@/app/types/questions"; // Adjust this according to your actual type
import { useSearchParams } from 'next/navigation'

const ExamTemplateQuestionsPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams()
  const examTemplateId = searchParams.get('template_id')

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!examTemplateId) return;

      try {
        const data = await examService.useGetExamTemplateQuestions(Number(examTemplateId)); // Use the extracted examTemplateId
        if (data) {
          setQuestions(data.questions); // Assuming 'questions' is an array
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [examTemplateId]); // Rerun the effect if examTemplateId changes

  return (
    <div className="flex flex-col items-center p-5">
      <Card className="w-full max-w-4xl p-6">
        <CardHeader>
          <CardTitle>Exam Template Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {questions.length > 0 ? (
              questions.map((question, index) => (
                <Card key={index} className="p-4 bg-gray-100">
                  <CardHeader>
                    <CardTitle>Question {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{question.text}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>Loading questions...</p>
            )}
          </div>
          <div className="mt-8 flex justify-center">
            <Button variant="default" onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamTemplateQuestionsPage;
