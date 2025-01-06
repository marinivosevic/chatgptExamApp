"use client";
import React,{useState} from "react";
import ExamCard from "@/components/examCard";
import { useUser } from "@/app/context/userContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { courseService } from "../api/courseService";
import { Course } from "../types/course";
function Dashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  if (!user) {
    return <p>Loading...</p>;
    // Redirect to login page
  }
  if(user.role === "superAdmin" && courses.length === 0){
    courseService.useGetAllCourses().then((data) => {
      if (data) {
        console.log(data);
        setCourses(data);
      }
    }
    );
  }
  
  if((user.role === "student" || user.role === "profesor") && courses.length === 0){
    courseService.useGetUsersCourses(user.id).then((data) => {
      if (data) {
        console.log(data);
        setCourses(data);
      }
    }
    );
  }

  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Courses</h1>
        {user.role === "superAdmin" && (
          <Button
            variant="default"
            onClick={() => router.push("/dashboard/courses/createCourse")}
          >
            Add Course
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {courses.map((course) => (
          <ExamCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
export default Dashboard;
