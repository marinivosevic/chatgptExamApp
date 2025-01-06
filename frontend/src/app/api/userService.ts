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
  }
};
