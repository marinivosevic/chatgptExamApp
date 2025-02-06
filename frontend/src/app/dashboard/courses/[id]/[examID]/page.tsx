'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { examService } from '@/app/api/examService';
import { useParams } from 'next/navigation';

const ExamSession = () => {
    const params = useParams();
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes (300 seconds)
    const [session, setSession] = useState(null);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            alert('Time is up! Submitting the exam.');
            endExam();
        }
    }, [timeLeft]);

    const startExam = async () => {
        const user = localStorage.getItem('user');
        let user_id;
        if (user) {
            user_id = JSON.parse(user).id;
        }
        const exam_id = Array.isArray(params.examID) ? parseInt(params.examID[0], 10) : parseInt(params.examID, 10);
        const data = await examService.useStartExam(exam_id, user_id);
        if (data) {
            setSession(data.session);
            setQuestions(data.questions);
        }
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            alert('Exam completed!');
            endExam();
        }
    };
    const lastQuestion = () => {
        if (currentIndex < questions.length) {
            setCurrentIndex(currentIndex - 1);
        } else {
            alert('Exam completed!');
            endExam();
        }
    };

    const endExam = async () => {
        // Logic to submit answers and finish session
        alert('Exam ended. Submitting answers...');
    };

    return (
        <div className="flex flex-col items-center justify-center p-6">
            {!session ? (
                <Button variant="default" onClick={startExam}>Start Exam</Button>
            ) : (
                <div className="w-full max-w-lg text-center border p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</h2>
                    <h3 className="text-lg font-semibold">Question {currentIndex + 1} / {questions.length}</h3>
                    <p className="text-md mt-4">{questions[currentIndex]?.text}</p>
                    {currentIndex > 0 && (
                        <Button className="mt-4" onClick={lastQuestion}>
                            Last Question
                        </Button>
                    )}
                    <Button className="mt-4" onClick={nextQuestion} disabled={currentIndex >= questions.length - 1}>
                        {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Exam'}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ExamSession;
