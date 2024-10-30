import express from 'express';
import { CategoryService } from '../services/category.service';
import { jwtIsAuthenticated } from '../middleware/auth.middleware';

const router = express.Router();
const categoryService = new CategoryService();

router.get('/categories', jwtIsAuthenticated, async (req, res) => {
  const examId = req.user.exam_id;
  if (!examId) {
    return res.status(400).json({ message: "L'exam_id est introuvable dans le token utilisateur." });
  }

  try {
    const categories = await categoryService.getCategoriesByExamId(examId);
    res.status(200).json(categories);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des catégories' });
  }
});

export default router;
