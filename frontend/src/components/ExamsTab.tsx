"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ExamsTab = () => {
  const mockExams = [
    { id: 1, name: "Midterm Exam", color: "bg-blue-500" },
    { id: 2, name: "Final Exam", color: "bg-green-500" },
    { id: 3, name: "Quiz 1", color: "bg-yellow-500" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {mockExams.map((exam) => (
        <Card key={exam.id} className={`p-4 ${exam.color} text-white`}>
          <CardHeader>
            <CardTitle>{exam.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Exam details go here...</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ExamsTab;