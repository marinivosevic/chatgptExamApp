"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/app/context/userContext";

import { examService } from "@/app/api/examService";
import { ExamResponse } from "@/app/types/examResponse";

// Helper function to generate a random color
const getRandomColor = () => {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-teal-500",
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

interface ExamsTabProps {
  courseId: number;
}

const ExamsTab: React.FC<ExamsTabProps> = ({ courseId }) => {
  const [exams, setExams] = useState<ExamResponse[]>([]);
  const saveLinkToLocalStorage = () => {
    localStorage.setItem("link", window.location.href);
  };

  useEffect(() => {
    if (exams?.length === 0) {
      examService.useGetCourseExams(courseId).then((data) => {
        console.log(data);
        if (data) {
          setExams(data.exams); // Just store the exams without the color
        }
      });
    }
    saveLinkToLocalStorage();
  }, [courseId, exams]);

  const { user } = useUser();

  if (!exams) {
    return <p>Loading course details...</p>;
  }

  return (
    <div>
      <div>
        {(user.role === "superAdmin" || user.role === "profesor") ? (
          <div className="flex gap-4">
            <a href={`/dashboard/examTemplateCreation?course_id=${courseId}`}>
              <Button variant="default">Create New Exam Template</Button>
            </a>
            <a href={`/dashboard/examSessionCreation?course_id=${courseId}`}>
              <Button variant="default">Create New Exam Session</Button>
            </a>
          </div>
        ) : null}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {exams.map((exam) => (
          <a key={exam.title} href={`/${exam.id}`}  >
            <Card className={`p-4 ${getRandomColor()} text-white transform transition-transform duration-300 hover:scale-105`}>
              <CardHeader>
                <CardTitle>{exam.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{exam.date}</p>
                <p>{exam.start_time}</p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ExamsTab;
