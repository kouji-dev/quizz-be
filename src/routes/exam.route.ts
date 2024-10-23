import express from 'express';
import { ExamService } from '../services/exam.service';
import { isAuthenticated } from '../middleware/auth.middleware';

const router = express.Router();
const examService = new ExamService();

// Route GET pour lister tous les examens avec vérification de l'authentification
router.get('/exams', isAuthenticated, async (req, res) => {
  try {
    const exams = await examService.getAllExams();  // Utilisation du service pour récupérer les examens
    res.status(200).json(exams);
  } catch (error) {
    console.error('Erreur lors de la récupération des examens', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des examens' });
  }
});

export default router;
