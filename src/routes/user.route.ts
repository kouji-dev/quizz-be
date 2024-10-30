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

// Route GET pour récupérer le profil de l'utilisateur authentifié
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



// Route PUT pour associer un examen à un utilisateur
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
