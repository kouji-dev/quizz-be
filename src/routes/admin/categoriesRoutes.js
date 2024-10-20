// routes/adminGestions.js

import { db } from '../db/db.ts';
import { categories } from '../db/schemas/categories.ts';
import { eq } from 'drizzle-orm/expressions';

// Route POST : Créer une nouvelle catégorie avec avatar et description
router.post('/categories', async (req, res) => {
  const { exam_id, category_name, description, avatar_url } = req.body;
  try {
    const result = await db.insert(categories).values({
      exam_id,
      category_name,
      description, // Ajout de la description
      avatar_url, // URL de l'avatar
    }).returning();
    res.status(201).json(result);
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie', error);
    res.status(500).json({ message: 'Erreur lors de la création de la catégorie' });
  }
});

// Route GET : Récupérer toutes les catégories
router.get('/categories', async (req, res) => {
    try {
      const result = await db.select().from(categories);
      res.status(200).json(result);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des catégories' });
    }
  });

// Route GET : Récupérer une catégorie par son ID
router.get('/categories/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await db.select().from(categories).where(eq(categories.id, id));
      if (result.length === 0) {
        return res.status(404).json({ message: 'Catégorie non trouvée' });
      }
      res.status(200).json(result[0]);
    } catch (error) {
      console.error('Erreur lors de la récupération de la catégorie', error);
      res.status(500).json({ message: 'Erreur lors de la récupération de la catégorie' });
    }
  });

// Route PUT : Mettre à jour une catégorie par son ID
router.put('/categories/:id', async (req, res) => {
    const { id } = req.params;
    const { category_name, description, avatar_url } = req.body;
    try {
      const result = await db.update(categories)
        .set({ category_name, description, avatar_url }) // Mise à jour des champs
        .where(eq(categories.id, id))
        .returning();
      if (result.length === 0) {
        return res.status(404).json({ message: 'Catégorie non trouvée' });
      }
      res.status(200).json(result[0]);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la catégorie', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour de la catégorie' });
    }
});

// Route DELETE : Supprimer une catégorie par son ID
router.delete('/categories/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await db.delete(categories).where(eq(categories.id, id)).returning();
      if (result.length === 0) {
        return res.status(404).json({ message: 'Catégorie non trouvée' });
      }
      res.status(200).json({ message: 'Catégorie supprimée avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie', error);
      res.status(500).json({ message: 'Erreur lors de la suppression de la catégorie' });
    }
  });

// Route GET : Récupérer les catégories d'un examen spécifique
router.get('/exams/:exam_id/categories', async (req, res) => {
    const { exam_id } = req.params;
    
    try {
      // Récupérer les catégories en filtrant par exam_id
      const result = await db.select().from(categories).where(eq(categories.exam_id, exam_id));
      
      if (result.length === 0) {
        return res.status(404).json({ message: 'Aucune catégorie trouvée pour cet examen.' });
      }
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des catégories.' });
    }
  });

export default router;


