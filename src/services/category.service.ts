import { db } from '../db/database';
import { categories } from '../db/schemas/categories';
import { CategoryDTO } from '../dto/category.dto';
import { eq } from 'drizzle-orm/expressions';

export class CategoryService {
  async getCategoriesByExamId(examId: number): Promise<CategoryDTO[]> {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.exam_id, examId)); 

    return result.map((category) => ({
      id: category.id,
      exam_id: category.exam_id,
      name: category.name,
      description: category.description,
      styles: category.styles,
    }));
  }
}
