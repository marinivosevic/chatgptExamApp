"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExamTemplate } from "@/app/types/examTemplate";
import { examService } from "@/app/api/examService";
import { Button } from "./ui/button";

const UsersTab = ({ courseId }: { courseId: number }) => {
  const [templates, setTemplates] = useState<ExamTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch users already in the course
  useEffect(() => {
    examService.useGetExamTemplatesInCourse(courseId).then((data) => {
      console.log(data);
      setTemplates(data.templates);
      setLoading(false);
    });

  }, [courseId]);

  if (loading) {
    return <p>Loading Exam Templates...</p>; // Show loading message while fetching data
  }

  if (templates.length === 0) {
    return <p>No Exam Templates Found</p>;
  }


  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="shadow-md hover:shadow-lg transition">
            <CardHeader>
              <CardTitle>{template.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>
              <p className="text-sm text-muted-foreground">
                Questions: {template.questions.length}
              </p>
              <p className="text-sm text-muted-foreground">
                Created: {new Date(template.created_at).toLocaleDateString()}
              </p>
              <a href={`/dashboard/examTemplate?template_id=${template.id}`}>
                <Button
                  variant="default"
                >
                  View Questions
                </Button>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>



    </div >
  );
};

export default UsersTab;
