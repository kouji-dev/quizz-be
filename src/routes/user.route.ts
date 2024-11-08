import express, { Request } from 'express';
import { UserService } from '../services/user.service';
import { UpdateUserExamDTO } from '../dto/exam.dto';
import { jwtIsAuthenticated } from '../middleware/auth.middleware';


const router = express.Router();
const userService = new UserService();

// Middleware pour vérifier si l'utilisateur est authentifié
const isAuthenticated = (req, res, next) => {
  if (req.jwtIsAuthenticated()) {
    return next();
  }
  res.redirect('/auth/google');
};

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Récupère le profil de l'utilisateur authentifié
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []  # Nécessite un token JWT pour l'authentification
 *     responses:
 *       200:
 *         description: Profil de l'utilisateur authentifié.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Identifiant de l'utilisateur
 *                 name:
 *                   type: string
 *                   description: Nom de l'utilisateur
 *                 email:
 *                   type: string
 *                   description: Email de l'utilisateur
 *                 exam_id:
 *                   type: integer
 *                   description: ID de l'examen associé à l'utilisateur
 *       400:
 *         description: ID utilisateur introuvable.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ID utilisateur introuvable."
 *       404:
 *         description: Utilisateur non trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur non trouvé."
 *       500:
 *         description: Erreur lors de la récupération du profil.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur lors de la récupération du profil."
 */
router.get('/user/profile', jwtIsAuthenticated, async (req: Request, res): Promise<void> => {
  const userId = req.user?.id;
 

  if (!userId) {
    res.status(400).json({ message: 'ID utilisateur introuvable.' });
    return; // Ajoute un `return` pour que la fonction retourne `void`
  }

  try {
    // Récupérer les informations de l'utilisateur
    const user = await userService.getUserById(userId);

    if (!user) {
      res.status(404).json({ message: 'Utilisateur non trouvé.' });
      return; // Ajoute un `return` pour que la fonction retourne `void`
    }

    res.status(200).json(user);
    return; // Ajoute un `return` pour que la fonction retourne `void`
  } catch (error) {
    console.error('Erreur lors de la récupération du profil :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du profil.' });
    return; // Ajoute un `return` pour que la fonction retourne `void`
  }
});


/**
 * @swagger
 * /user/exam:
 *   put:
 *     summary: Associe un examen à l'utilisateur authentifié
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []  # Nécessite un token JWT pour l'authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               examId:
 *                 type: integer
 *                 description: ID de l'examen à associer
 *     responses:
 *       200:
 *         description: Examen mis à jour pour l'utilisateur authentifié.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Identifiant de l'utilisateur
 *                 name:
 *                   type: string
 *                   description: Nom de l'utilisateur
 *                 email:
 *                   type: string
 *                   description: Email de l'utilisateur
 *                 exam_id:
 *                   type: integer
 *                   description: ID de l'examen associé à l'utilisateur
 *       400:
 *         description: ID utilisateur introuvable.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ID utilisateur introuvable."
 *       500:
 *         description: Erreur lors de la mise à jour de l'examen.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur lors de la mise à jour de l'examen."
 */
router.put('/user/exam', jwtIsAuthenticated, async (req, res): Promise<void> => {
  const userId = req.user?.id; 

  if (!userId) {
    res.status(400).json({ message: 'ID utilisateur introuvable.' });
    return; // Ajoute un `return` pour que la fonction retourne `void`
  }

  const examData: UpdateUserExamDTO = req.body;

  try {
    // Mettre à jour l'examen pour l'utilisateur authentifié
    const updatedUser = await userService.updateUserExam(userId, examData);
    res.status(200).json(updatedUser);
    return; // Ajoute un `return` ici pour indiquer la fin de la fonction
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'examen :', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'examen' });
    return; // Ajoute un `return` ici aussi
  }
});






export default router;
