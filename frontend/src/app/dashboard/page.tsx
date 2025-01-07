"use client";
import React,{ useEffect, useState} from "react";
import ExamCard from "@/components/examCard";
import { useUser } from "@/app/context/userContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { courseService } from "../api/courseService";
import { Course } from "../types/course";
import Link from "next/link";
function Dashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchCourses = async () => {
      try {
        let data: Course[] = [];
        if (user.role === "superAdmin") {
          data = await courseService.useGetAllCourses();
        } else if (user.role === "student" || user.role === "profesor") {
          data = await courseService.useGetUsersCourses(user.id);
        }
        if (data) {
          setCourses(Array.isArray(data) ? data : [data]); // Ensure data is an array
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  if (!user) {
    return <p>Loading...</p>;
  }

  if (loading) {
    return <p>Loading courses...</p>;
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
          <Link key={course.id} href={`/dashboard/courses/${course.id}`}>
          <ExamCard course={course} />
        </Link>
        ))}
      </div>
    </div>
  );
}
export default Dashboard;
