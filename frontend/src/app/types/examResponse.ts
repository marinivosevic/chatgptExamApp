export interface ExamResponse {
    id: number;
    title: string;
    time: string;
    course_id: number;
    date: Date;
    access_code: string;
    exam_template_id: number;
    start_time: string;
}