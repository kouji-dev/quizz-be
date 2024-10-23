import express from 'express';
import { UserService } from '../services/user.service';
import { UpdateUserExamDTO } from '../dto/exam.dto';

const router = express.Router();
const userService = new UserService();

// Middleware pour vérifier si l'utilisateur est authentifié
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/google');
};

// Route PUT pour associer un examen à un utilisateur
router.put('/users/:id/exam', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const examData: UpdateUserExamDTO = req.body;

  try {
    const updatedUser = await userService.updateUserExam(Number(id), examData);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'examen' });
  }
});

export default router;
