"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { courseService } from "@/app/api/courseService";
import { Course } from "@/app/types/course";
import { User } from "@/app/types/user";
import { userService } from "@/app/api/userService";

const initialValues = {
  name: "",
  course_manager_id: "", // Make sure this is a string
};

const Schema = Yup.object().shape({
  name: Yup.string().required("Required"),
  course_manager_id: Yup.string().required("Required"),
});

const CreateCourseForm = () => {
  const [professors, setProfessors] = useState<User[]>([]);
  const router = useRouter();

  const handleSubmit = async (values, { setSubmitting }) => {
    courseService.useCreateCourse(values).then((data: Course) => {
      if (data) {
        console.log(data);
        router.push("/dashboard");
      }
    });
  };

  useEffect(() => {
    userService.useGetProfesors().then((data) => {
      if (data) {
        console.log("Fetched Professors:", data);
        setProfessors(data);
      }
    });
  }, []);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Schema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, isSubmitting, values }) => (
        <Form className="space-y-4 p-4 max-w-md mx-auto">
          <div>
            <Label htmlFor="name">Course Name</Label>
            <Field
              id="name"
              name="name"
              type="text"
              placeholder="Enter course name"
              as={Input}
            />
            <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
          </div>

          <div>
            <Label htmlFor="course_manager_id">Course Manager</Label>
            <Select
              value={values.course_manager_id} // Bind the selected value here
              onValueChange={(value) => {
                // Ensure that the value is always a string
                setFieldValue("course_manager_id", String(value));
              }}
            >
              <SelectTrigger id="course_manager_id">
                <SelectValue
                  placeholder="Select a course manager"
                  value={values.course_manager_id}
                />
              </SelectTrigger>
              <SelectContent>
                {professors.map((professor) => (
                  <SelectItem key={professor.id} value={professor.id.toString()}> {/* Ensure the value is a string */}
                    {professor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ErrorMessage name="course_manager_id" component="div" className="text-red-500 text-sm" />
          </div>

          <Button type="submit" variant="default" className="w-full" disabled={isSubmitting}>
            Create Course
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default CreateCourseForm;
