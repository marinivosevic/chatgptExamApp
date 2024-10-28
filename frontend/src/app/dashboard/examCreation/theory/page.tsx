'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const ExamCreationForm = () => {
  const [testName, setTestName] = useState('');
  const [testLength, setTestLength] = useState('');
  const [questions, setQuestions] = useState([{ question: '', points: '' }]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', points: '' }]);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
    console.log(questions); 
  };

  const handlePointsChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].points = value;
    setQuestions(newQuestions);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl text-center mb-8">Create a new theory exam</h1>
      <form className="w-full max-w-2xl p-8 bg-white shadow-md rounded-lg">
        <div className="flex flex-row gap-4 mb-4">
          <div className="w-1/2">
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
            <Label htmlFor="testLength">Test Length (minutes)</Label>
            <Input
              id="testLength"
              type="number"
              value={testLength}
              onChange={(e) => setTestLength(e.target.value)}
              className="w-full p-4"
            />
          </div>
        </div>
        {questions.map((q, index) => (
          <div key={index} className="mb-4">
            <Label htmlFor={`question${index + 1}`}>Question {index + 1}</Label>
            <div className="flex flex-row gap-4">
              <Textarea
                id={`question${index + 1}`}
                value={q.question}
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
        <Button type="button" onClick={handleAddQuestion} className="w-full p-4 mt-4">
          Add New Question
        </Button>
      </form>
    </div>
  );
};

export default ExamCreationForm;