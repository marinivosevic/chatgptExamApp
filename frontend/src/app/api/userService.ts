import { CreateUser } from "../types/createUser";
import { axiosInstance } from "./config/axios";
import Cookies from "js-cookie";

export const userService = {
  useGetAllUsers: async () => {
    try {
      const response = await axiosInstance.get("/users");
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  useCreateUser: async (data: CreateUser) => {
    const dataToSend = JSON.stringify(data);
    const token = Cookies.get("token");
    try {
      const response = await axiosInstance.post("/auth/register", dataToSend, {
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

  useGetProfesors: async () => {
    try {
      const response = await axiosInstance.get("/users/profesors");
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  useGetUserById: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  useGetUsersInCourse: async (courseId: number) => {
    try {
      const response = await axiosInstance.get(`/courses/${courseId}/users`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  useGetAllStudents: async () => {
    try {
      const response = await axiosInstance.get("/users/students");
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  useAddUsersToCourse: async (course_id: number, user_id: number) => {
    const dataToSend = JSON.stringify({ course_id, user_id });
    console.log(dataToSend);
    try {
      const response = await axiosInstance.post(
        `/courses/addUserToCourse`,
        dataToSend
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
};
