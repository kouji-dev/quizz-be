import { db } from '../db/database';
import { users } from '../db/schemas/users';
import { UserDTO} from '../dto/user.dto';
import {UpdateUserExamDTO} from '../dto/exam.dto';
import { eq } from 'drizzle-orm/expressions';

export class UserService {
  async findOrCreateUser(profile: any): Promise<UserDTO> {
    let user = await db.select().from(users).where(eq(users.google_id, profile.id)).limit(1);

    // Si l'utilisateur n'existe pas, on le crée
    if (user.length === 0) {
        const newUser: Partial<UserDTO> = {
          google_id: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName || undefined,
          avatar_url: profile.photos ? profile.photos[0].value : undefined,
          exam_id: null
        };
  
        user = await db.insert(users).values(newUser).returning();
      }

    return user[0]; // Renvoyer le premier utilisateur (ou celui nouvellement créé)
  }

  async updateUserExam(userId: number, examData: UpdateUserExamDTO): Promise<UserDTO> {
    const updatedUser = await db.update(users)
      .set({ exam_id: examData.exam_id })
      .where(eq(users.id, userId))
      .returning();

    return updatedUser[0];
  }
}
