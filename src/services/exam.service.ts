import { db } from '../db/database';
import { exams } from '../db/schemas/exams';
import { ExamDTO } from '../dto/exam.dto';

export class ExamService {
  async getAllExams(): Promise<ExamDTO[]> {
    const result = await db.select().from(exams); // Récupère tous les examens
    return result.map((exam) => ({
      id: exam.id,
      name: exam.name,
      description: exam.description,
      avatar_url: exam.avatar_url,
    }));
  }
}
