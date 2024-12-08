// File: page.tsx
'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
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
import axios from "axios";
import { useUser } from "@/app/context/userContext";

// Define the initial form values
const initialValues = {
  email: "",
  password: "",
};

// Define the validation schema using Yup
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too Short!").required("Required"),
});

// Define the structure for form values
interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const { setUser,user } = useUser() // Get setUser from context
  // Handle form submission
  const handleSubmit = async (values: LoginFormValues, { setSubmitting }: any) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': Cookies.get('_xsrf') || '',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle errors returned from the server
        setFormError(data.message || 'Something went wrong');
        setSubmitting(false);
        return;
      }

      // Set user data in context and store in localStorage
      Cookies.set('token', data.token);
      setUser(data.user);

      // Delay before redirecting
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000); // 1 second delay

      console.log('User set:', data.user);
    } catch (error) {
      console.error('Error:', error);
      setFormError('An unexpected error occurred');
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center p-5 ">
      <div className="max-w-4xl ">
        <div className="text-center mb-8">
          {/* Uncomment the Image component if you have a logo */}
          {/* <Image
            src={logo}
            alt="Logo"
            className="w-20 h-20 mx-auto mb-4"
            width={80}
            height={80}
          /> */}
         
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="">
              <Card className="mx-auto max-w-sm p-10">
                <CardHeader>
                  <CardTitle className="text-2xl">Login</CardTitle>
                  <CardDescription>
                    Enter your email below to login to your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Field
                        as={Input}
                        id="email"
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <Link
                          href="#"
                          className="ml-auto inline-block text-sm underline"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    {formError && (
                      <div className="text-red-500 text-center text-sm">
                        {formError}
                      </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                   
                  </div>
                  <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="underline">
                      Sign up
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </Form>
          )}
        </Formik>
      </div>
      </div>
  );
}