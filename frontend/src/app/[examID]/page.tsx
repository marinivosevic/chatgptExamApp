'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { examService } from '@/app/api/examService';
import { useParams } from 'next/navigation';
import { Editor } from '@monaco-editor/react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const ExamSession = () => {
    const params = useParams();
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes (300 seconds)
    const [session, setSession] = useState<{ id: number; time: number } | null>(null);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [password, setPassword] = useState('');
    // State for the width of the left and right sections
    const [leftWidth, setLeftWidth] = useState(50); // Initial left width 50%
    const [isResizing, setIsResizing] = useState(false);
    const [isExamStarted, setIsExamStarted] = useState(false); // To track if the exam has started
    const router = useRouter();

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            alert('Time is up! Submitting the exam.');
            endExam();
        }
    }, [timeLeft]);

    const validatePassword = async (exam_id: number, password: string) => {
        // Call your backend to validate the password
        const response = await examService.useValidatePassword(exam_id, password);

        return response.isValid;
    };

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const startExam = async () => {
        const user = localStorage.getItem('user');
        let user_id;
        if (user) {
            user_id = JSON.parse(user).id;
        }

        const exam_id = Array.isArray(params.examID) ? parseInt(params.examID[0], 10) : parseInt(params.examID, 10);

        // Send password to the backend for validation
        const isPasswordValid = await validatePassword(exam_id, password);
        if (isPasswordValid) {
            const data = await examService.useStartExam(exam_id, user_id);
            if (data) {
                setSession(data.session);
                setQuestions(data.questions);
                setTimeLeft(data.session.time * 60);
                setIsExamStarted(true); // Set exam started flag to true
                setIsDialogOpen(false); // Close the dialog
            }
        } else {
            alert('Invalid password');
        }
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            endExam();
        }
    };

    const lastQuestion = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleAnswerChange = (value: string | undefined, questionID: number) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionID]: value || ""
        }));
    };

    const submitAnswer = async (sessionID: number, questionID: number) => {
        if (session?.id && questionID) {
            const answerToSubmit = answers[questionID] || "";
            const data = await examService.useSubmitAnswer(session.id, questionID, answerToSubmit);
            if (data) {
                console.log('Answer submitted successfully');
            }
        }
    };

    const endExam = async () => {
        if (session?.id) {
            const user = localStorage.getItem('user');
            const exam_id = Array.isArray(params.examID) ? parseInt(params.examID[0], 10) : parseInt(params.examID, 10);
            let user_id;

            if (user) {
                user_id = JSON.parse(user).id;
            }
            const data = await examService.useEndExam(exam_id, user_id);
            if (data) {
                console.log('Exam ended successfully');
                router.push('/dashboard');
            }
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsResizing(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isResizing) {
            const newLeftWidth = Math.min(100, Math.max(10, (e.clientX / window.innerWidth) * 100));
            setLeftWidth(newLeftWidth);
        }
    };

    const handleMouseUp = () => {
        setIsResizing(false);
    };

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    return (
        <div className="flex h-screen bg-zinc-800 text-white">
            {/* Show Start Exam Button if exam has not started */}
            {!isExamStarted ? (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="default" onClick={() => setIsDialogOpen(true)} className="m-auto">
                            Start Exam
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Enter Exam Password</DialogTitle>
                            <DialogDescription>
                                Please enter the password to start the exam.
                            </DialogDescription>
                        </DialogHeader>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border p-2 w-full mb-4"
                            placeholder="Password"
                        />
                        <DialogFooter>
                            <Button onClick={startExam} className="w-full">Submit</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            ) : (
                <div style={{ width: `${leftWidth}%` }} className="flex flex-col p-4 justify-between">
                    <div>
                        {/* Timer */}
                        <h2 className="text-5xl font-bold mb-4 text-center">
                            Time Left: {formatTime(timeLeft)}
                        </h2>

                        {/* Question */}
                        <h3 className="text-xl font-semibold mb-4">Question {currentIndex + 1} / {questions.length}</h3>
                        <p className="text-lg mb-4">{questions[currentIndex]?.text}</p>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between w-full mt-auto">
                        <Button onClick={lastQuestion}>Last Question</Button>
                        <Button onClick={() => {
                            if (currentIndex < questions.length - 1) {
                                nextQuestion();
                                submitAnswer(session.id, questions[currentIndex]?.id);
                            } else {
                                endExam();  // If it's the last question, finish the exam
                            }
                        }}>
                            {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Exam'}
                        </Button>
                    </div>
                </div>
            )}

            {/* Divider */}
            <div
                onMouseDown={handleMouseDown}
                className="bg-gray-600 cursor-ew-resize"
                style={{ width: '5px', height: '100%' }}
            ></div>

            {/* Right Section for Editor */}
            {isExamStarted && (
                <div style={{ width: `${100 - leftWidth}%` }} className="flex flex-col">
                    <Editor
                        height="100%"
                        theme="vs-dark"
                        defaultLanguage="javascript"
                        value={answers[questions[currentIndex]?.id] || ""}
                        onChange={(value) => handleAnswerChange(value, questions[currentIndex]?.id)}
                    />
                </div>
            )}
        </div>
    );
};

export default ExamSession;
