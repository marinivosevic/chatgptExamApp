import { ExamRequest } from "../types/examRequest";
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
    useGetExamTemplates: async (course_id:number) => {
        try {
            const response = await axiosInstance.get(`/getTemplatesInCourse/${course_id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching exam templates:", error);
            return null;
        }
    },
    useCreateExam: async (data: ExamRequest) => {
        const dataToSend = JSON.stringify(data);
        //!const token = Cookies.get("token");
        console.log(dataToSend);
        try {
            const response = await axiosInstance.post("/create-exam", dataToSend, {
                headers: {
                    //Authorization: `Bearer ${token}`, // Attach the token here
                    "Content-Type": "application/json", // Ensure JSON format is specified
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error creating exam:", error);
            return null;
        }
    },
    useGetCourseExams: async (course_id: number) => {
        try {
            const response = await axiosInstance.get(`/courses/${course_id}/exams`);
            return response.data;
        } catch (error) {
            console.error("Error fetching exams:", error);
            return null;
        }
    },
    useGetExamTemplateQuestions: async (template_id: number) => {
        try {
            const response = await axiosInstance.get(`/questionInExamTemplate/${template_id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching questions:", error);
            return null;
        }
    },
    useStartExam: async (exam_id: number,user_id:number) => {
        try {
            const data = JSON.stringify({exam_id:exam_id,user_id:user_id});
            console.log(data);
            const response = await axiosInstance.post(`/start-session`,data);
            return response.data;
        } catch (error) {
            console.error("Error starting exam:", error);
            return null;
        }
    },
    useEndExam: async (exam_id: number,user_id:number) => {
        try {
            const data = JSON.stringify({exam_id:exam_id,user_id:user_id,});
            console.log(data);
            const response = await axiosInstance.post(`/end-session`,data);
            return response.data;
        } catch (error) {
            console.error("Error starting exam:", error);
            return null;
        }
    },
    useSubmitAnswer: async (session_id: number, question_id: number, answer: string) => {
        try {
            console.log(answer)
            const data = JSON.stringify({exam_session_id:session_id,question_id:question_id,answer:answer});
            console.log(data);
            const response = await axiosInstance.post(`/exam/saveAnswers`,data);
            return response.data;
        } catch (error) {
            console.error("Error submitting answer:", error);
            return null;
        }
    },
    useValidatePassword: async (exam_id: number, password: string) => {
        try {
            const data = JSON.stringify({exam_id:exam_id,access_code:password});
            console.log(data);
            const response = await axiosInstance.post(`/validate-access-code`,data);
            return response.data;
        } catch (error) {
            console.error("Error validating password:", error);
            return null;
        }
    }
    

}