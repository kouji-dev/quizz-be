// routes/examRoutes.js
import express, { Request, Response } from 'express';
import { db } from '../../db/database'; // Connexion à la base de données
import { exams,Exam} from '../../db/schemas/exams'; // Le modèle de la table exams
import { eq } from 'drizzle-orm/expressions';


const router = express.Router();

interface ExamRequestBody {
  exam_name: string;
  description: string;
  avatar_url: string;
}

// Route POST : Créer un nouvel examen
router.post('/exams', async (req: Request<{}, {}, ExamRequestBody>, res) => {
  const { exam_name, description, avatar_url } = req.body;
  try {
    const result = await db.insert(exams).values(
      req.body
    ).returning();
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'examen' });
  }
});

// Route GET : Récupérer tous les examens
router.get('/exams', async (req: Request<{}, {}, ExamRequestBody>, res) => {
  try {
    const result = await db.select().from(exams);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des examens' });
  }
});

// Route GET : Récupérer un examen par ID
router.get('/exams/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  try {
    const result = await db.select().from(exams).where(eq(exams.id, id));
    if (result.length === 0) {
      res.status(404).json({ message: 'Examen non trouvé' });
    } else {
      res.status(200).json(result[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'examen' });
  }
});

// Route PUT : Mettre à jour un examen
router.put('/exams/:id', async (req: Request<{}, {}, ExamRequestBody>, res) => {
  const { id } = req.params;
  const { exam_name, description, avatar_url } = req.body;
  try {
    const result = await db.update(exams)
      .set(req.body)
      .where(eq(exams.id, id))
      .returning();
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'examen' });
  }
});

// Route DELETE : Supprimer un examen
router.delete('/exams/:id', async (req: Request<{}, {}, ExamRequestBody>, res) => {
  const { id } = req.params;
  try {
    await db.delete(exams).where(eq(exams.id, id));
    res.status(200).json({ message: 'Examen supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'examen' });
  }
});

export default router;
