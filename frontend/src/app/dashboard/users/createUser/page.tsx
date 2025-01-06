"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { userService } from "@/app/api/userService";


   const initialValues = {
      email: "",
      name: "",
      password: "",
      role: "",
    }

    const LoginSchema = Yup.object().shape({
      email: Yup.string().email("Invalid email").required("Required"),
      name: Yup.string().required("Required"),
      password: Yup.string().min(6, "Too Short!").required("Required"),
      confirmPass: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match"),
      role: Yup.string().required("Required"),
    });

const CreateUserForm = () => {
 
    const router = useRouter();
    const handleSubmit = async (values, { setSubmitting }) => {
        console.log("pressed");
        userService.useCreateUser(values).then((data) => {
            if (data) {
                console.log(data);
                router.push("/dashboard/users");
            }
        });

    }

   

  return (
    <Formik
    initialValues={initialValues}
    validationSchema={LoginSchema}
    onSubmit={handleSubmit}
  >
    {({ setFieldValue, isSubmitting }) => (
      <Form className="space-y-4 p-4 max-w-md mx-auto">
        <div>
          <Label htmlFor="email">Email</Label>
          <Field
            id="email"
            name="email"
            type="email"
            placeholder="Enter email"
            as={Input}
          />
          <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
        </div>

        <div>
          <Label htmlFor="name">User's Name</Label>
          <Field
            id="name"
            name="name"
            type="text"
            placeholder="Enter name"
            as={Input}
          />
          <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
        </div>

        

        <div>
          <Label htmlFor="password">Password</Label>
          <Field
            id="password"
            name="password"
            type="password"
            placeholder="Enter password"
            as={Input}
          />
          <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
        </div>

        <div>
          <Label htmlFor="confirmPass">Confirm Password</Label>
          <Field
            id="confirmPass"
            name="confirmPass"
            type="password"
            placeholder="Confirm password"
            as={Input}
          />
          <ErrorMessage name="confirmPass" component="div" className="text-red-500 text-sm" />
        </div>


        <div>
          <Label htmlFor="role">Role</Label>
          <Select
            onValueChange={(value) => setFieldValue("role", value)}
          >
            <SelectTrigger id="role">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professor">Professor</SelectItem>
              <SelectItem value="assistant">Assistant</SelectItem>
              <SelectItem value="student">Student</SelectItem>
            </SelectContent>
          </Select>
          <ErrorMessage name="role" component="div" className="text-red-500 text-sm" />
        </div>

        <Button type="submit" variant="default"  className="w-full" disabled={isSubmitting}>
          Create User
        </Button>
      </Form>
    )}
  </Formik>
  );
};

export default CreateUserForm;
