import { ExamTemplate } from "../types/examTemplate";
import { axiosInstance } from "./config/axios";
//import Cookies from "js-cookie";
export const examService = {

    useCreateExamTemplate: async (data: ExamTemplate) => {
        const dataToSend = JSON.stringify(data);
        //!const token = Cookies.get("token");
        try {
            const response = await axiosInstance.post("/create-template", dataToSend, {
                headers: {
                    //Authorization: `Bearer ${token}`, // Attach the token here
                    "Content-Type": "application/json", // Ensure JSON format is specified
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error creating user:", error);
            return null;
        }
    },
    useGetExamTemplatesInCourse: async (course_id: number) => {
        try {
            const response = await axiosInstance.get(`/getTemplatesInCourse/${course_id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching exam templates:", error);
            return null;
        }
    },

}