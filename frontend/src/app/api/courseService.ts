import { Course } from "../types/course";
import { axiosInstance } from "./config/axios";
import Cookies from "js-cookie";

export const courseService = {
 

  useCreateCourse: async (data: Course) => {
    const dataToSend = JSON.stringify(data);
    const token = Cookies.get("token");
    console.log(dataToSend);
    try {
      const response = await axiosInstance.post("/create-course", dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token here
          "Content-Type": "application/json", // Ensure JSON format is specified
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  },

  useGetAllCourses: async () => {
    const token = Cookies.get("token");
    try {
      const response = await axiosInstance.get("/courses", {headers: {
          Authorization: `Bearer ${token}`
        },
    });
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },


  useGetUsersCourses: async (id: number) => {
   
    try {
      const response = await axiosInstance.get(`/users/courses/${id}'`, 
    );
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  getCourseById: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
 
};
