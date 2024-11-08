import express from 'express';
import { ExamService } from '../services/exam.service';
import { jwtIsAuthenticated } from '../middleware/auth.middleware';

const router = express.Router();
const examService = new ExamService();

/**
 * @swagger
 * tags:
 *   name: Exams
 *   description: Routes pour la gestion des examens
 */

/**
 * @swagger
 * /exams:
 *   get:
 *     summary: Récupère la liste de tous les examens
 *     tags: [Exams]
 *     security:
 *       - BearerAuth: []  # Nécessite un token JWT pour l'authentification
 *     responses:
 *       200:
 *         description: Liste de tous les examens.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Identifiant de l'examen
 *                   name:
 *                     type: string
 *                     description: Nom de l'examen
 *                   description:
 *                     type: string
 *                     description: Description de l'examen
 *                   avatar_url:
 *                     type: string
 *                     description: URL de l'avatar associé à l'examen
 *       500:
 *         description: Erreur lors de la récupération des examens.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur lors de la récupération des examens"
 */
router.get('/exams', jwtIsAuthenticated, async (req, res) => {
  try {
    const exams = await examService.getAllExams();  // Utilisation du service pour récupérer les examens
    res.status(200).json(exams);
  } catch (error) {
    console.error('Erreur lors de la récupération des examens', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des examens' });
  }
});

export default router;
