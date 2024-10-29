import { db } from '../db/database';
import { users,User } from '../db/schemas/users';
import { UserDTO} from '../dto/user.dto';
import {UpdateUserExamDTO} from '../dto/exam.dto';
import { eq } from 'drizzle-orm/expressions';

export class UserService {
  async findOrCreateUser(profile: any): Promise<UserDTO> {
    let user = await db.select().from(users).where(eq(users.google_id, profile.id)).limit(1);

    // Si l'utilisateur n'existe pas, on le crée
    if (user.length === 0) {
        const newUser: typeof users.$inferInsert = {
          google_id: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName || undefined,
          avatar_url: profile.photos ? profile.photos[0].value : undefined,
         exam_id: null as number | null
        };
  
        user = await db.insert(users).values(newUser).returning();
      }

    return user[0]; // Renvoyer le premier utilisateur (ou celui nouvellement créé)
  }

  async updateUserExam(userId: number, examData: UpdateUserExamDTO): Promise<UserDTO> {
    const updatedUser = await db
      .update(users)
      .set({ exam_id: examData.exam_id })
      .where(eq(users.id, userId))
      .returning({ id: users.id, exam_id: users.exam_id, email: users.email, name: users.name, avatar_url: users.avatar_url, google_id: users.google_id }); // Préciser les champs à retourner

    return updatedUser[0];
  }

  async getUserById(userId: number) {
    try {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, userId)) 
        .limit(1);
      return user[0]; // Retourner le premier résultat, ou null si non trouvé
    } catch (error) {
      throw new Error('Erreur lors de la récupération de l\'utilisateur.');
    }
  }

}
