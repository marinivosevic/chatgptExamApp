'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { examService } from '@/app/api/examService';
import { Question } from '@/app/types/questions';
import  { useRouter, useSearchParams } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';

const ExamCreationForm = () => {
  const [testName, setTestName] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const course_id = Number(searchParams.get("course_id"));

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      examService.useCreateExamTemplate({title: testName, description: description,course_id: course_id ,questions: questions}).then((data) => {
        if (data) {
          console.log(data);
        }
        toast.success('Exam Template Created Successfully'); //add beteter feedback for user
        const link = localStorage.getItem('link');
        localStorage.removeItem('link');
        if (link) {
          router.push(link);
          
        } else {
          toast.error('Link not found');
        }
        
        
  })};


  const handleAddQuestion = () => {
    setQuestions([...questions, { text: '', points: 0 }]);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].text = value;
    setQuestions(newQuestions);
  };

  const handlePointsChange = (index: number, value: number) => {
    const newQuestions = [...questions];
    newQuestions[index].points = value;
    setQuestions(newQuestions);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl text-center mb-8">Create a new exam Template</h1>
      <form className="w-full max-w-3xl p-15 bg-white shadow-md rounded-lg">
        <div className="flex flex-row gap-4 mb-4 p-5">
          <div className="w-1/2">
            <ToastContainer />
            <Label htmlFor="testName">Test Name</Label>
            <Input
              id="testName"
              type="text"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              className="w-full p-4"
            />
          </div>
          <div className="w-1/2">
            <Label htmlFor="testLength">Description</Label>
            <Input
              id="testLength"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4"
            />
          </div>
        </div>
        {questions.map((q, index) => (
          <div key={index} className="mb-4 p-5">
            <Label htmlFor={`question${index + 1}`}>Question {index + 1}</Label>
            <div className="flex flex-row gap-4">
              <Textarea
                id={`question${index + 1}`}
                value={q.text}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                className="w-full p-4"
              />
              <div className="w-1/4">
                <Label htmlFor={`points${index + 1}`}>Points</Label>
                <Input
                  id={`points${index + 1}`}
                  type="number"
                  value={q.points}
                  onChange={(e) => handlePointsChange(index, e.target.value)}
                  className="w-full p-4"
                />
              </div>
            </div>
          </div>
        ))}
        <div className='flex flex-row justify-between'>
          <Button type="button" onClick={handleAddQuestion} className="w-full mx-3">
            Add New Question
          </Button>
          <Button type="submit" onClick={handleSubmit} className="w-full   mx-3 mb-3">
            Done
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ExamCreationForm;