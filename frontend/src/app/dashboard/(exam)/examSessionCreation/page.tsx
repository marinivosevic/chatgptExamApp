'use client';
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { examService } from "@/app/api/examService";
import { useSearchParams } from 'next/navigation'
import { ExamTemplate } from "@/app/types/examTemplate";

// Define the validation schema
const ExamSchema = Yup.object().shape({
  template_id: Yup.string().required("Exam template is required"),
  title: Yup.string().required("Title is required"),
  access_code: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  duration: Yup.number()
    .min(1, "Duration must be at least 1 minute")
    .required("Duration is required"),
  date: Yup.string().nullable().required("Date is required"),
  start_time: Yup.string().required("Start time is required") // Validation for start_time
});


// Initial form values
const initialValues = {
  template_id: "",
  title: "",
  duration: "",
  date: null,
  time: "",
  start_time: "", // New field for start time
  course_id: 0,
  access_code: ""
};


const CreateExamForm = () => {
  const [templates, setTemplates] = useState<ExamTemplate[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams()
  const courseId = searchParams.get('course_id')
  const link = localStorage.getItem("link");

  // Fetch exam templates


  useEffect(() => {
    const fetchTemplates = async () => {

      const data = await examService.useGetExamTemplates(Number(courseId));
      setTemplates(data.templates);

    };
    fetchTemplates();
  }, [courseId]);


  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      console.log(values);
  
      const response = await examService.useCreateExam({
        
        title: values.title,
        time: values.duration,
        course_id: Number(courseId),
        date: values.date || new Date, // Already in "YYYY-MM-DD" format
        start_time: values.start_time, // Include start time
        access_code: values.access_code,
        exam_template_id: Number(values.template_id),
      });
  
      if (response) {
        if (link) {
          router.push(link);
        } else {
          console.error("Link is undefined");
        }
      }
    } catch (error) {
      console.error("Error creating exam:", error);
    } finally {
      setSubmitting(false);
    }
  };
  

  if (!templates.length) {
    return <p>Loading course details...</p>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-5">
      <Formik
        initialValues={initialValues}
        validationSchema={ExamSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, isSubmitting, values }) => (
          <Form className="w-full max-w-3xl">
            <Card className="p-6">
              <CardHeader>
                <CardTitle>Create Exam</CardTitle>
                <CardDescription>
                  Fill in the details below to create a new exam.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Exam Template Dropdown */}
                  <div>
                    <Label htmlFor="template_id">Exam Template</Label>
                    <Field name="template_id">
                      {({ field }) => (
                        <Select onValueChange={(value) => setFieldValue("template_id", value)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a template" />
                          </SelectTrigger>
                          <SelectContent>
                            {templates.map((template) => (
                              <SelectItem key={template.id} value={template.id.toString()}>
                                {template.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </Field>
                    <ErrorMessage
                      name="template_id"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Title */}
                  <div>
                    <Label htmlFor="title">Exam Title</Label>
                    <Field
                      as={Input}
                      id="title"
                      name="title"
                      placeholder="Enter exam title"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <Label htmlFor="access_code">Password</Label>
                    <Field
                      as={Input}
                      id="access_code"
                      name="access_code"
                      type="password"
                      placeholder="Enter a secure password"
                    />
                    <ErrorMessage
                      name="access_code"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <Label htmlFor="duration">Duration (in minutes)</Label>
                    <Field
                      as={Input}
                      id="duration"
                      name="duration"
                      type="number"
                      placeholder="Enter duration"
                    />
                    <ErrorMessage
                      name="duration"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Start Time */}
                  <div>
                    <Label htmlFor="start_time">Start Time</Label>
                    <Field
                      as={Input}
                      id="start_time"
                      name="start_time"
                      type="time"
                      placeholder="Select start time"
                    />
                    <ErrorMessage
                      name="start_time"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Calendar
                      mode="single"
                      selected={values.date ? new Date(values.date) : undefined} // Convert string to Date object
                      onSelect={(date) => {
                        if (date) {
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
                          const day = String(date.getDate()).padStart(2, "0");
                          const formattedDate = `${year}-${month}-${day}`; // Format as "YYYY-MM-DD"

                          setFieldValue("date", formattedDate); // Update Formik's state with just the date
                        }
                      }}
                      className="w-full"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Exam"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Form>
        )}
      </Formik>

    </div>
  );
};

export default CreateExamForm;
