import { Question } from "./questions";

export interface ExamTemplate {
    id: number;
    title: string;
    description: string;
    questions: Question[];
    course_id: number;
    created_at: string;
}