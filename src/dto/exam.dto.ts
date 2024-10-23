export class UpdateUserExamDTO {
    exam_id: number | null;
  }

  export class ExamDTO {
    id: number;
    exam_name: string;
    description?: string;
    avatar_url?: string;
  }
  
  