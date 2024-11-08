import express from 'express';
import { CategoryService } from '../services/category.service';
import { jwtIsAuthenticated } from '../middleware/auth.middleware';

const router = express.Router();
const categoryService = new CategoryService();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Routes pour la gestion des catégories
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Récupère les catégories d'un examen spécifique
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des catégories de l'examen.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Identifiant de la catégorie
 *                   name:
 *                     type: string
 *                     description: Nom de la catégorie
 *                   description:
 *                     type: string
 *                     description: Description de la catégorie
 *                   styles:
 *                     type: object
 *                     description: Styles associés à la catégorie (format JSON)
 *       400:
 *         description: L'exam_id est introuvable dans le token utilisateur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "L'exam_id est introuvable dans le token utilisateur."
 *       500:
 *         description: Erreur lors de la récupération des catégories.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur lors de la récupération des catégories"
 */

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
