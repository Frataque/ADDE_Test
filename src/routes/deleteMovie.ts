import express, { Request, Response } from 'express';
import { auth } from '../middleware';
import { Movie } from '../models/Movie';

const router = express.Router();

router.delete('/movies', auth, async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.auth || !req.auth.userId) {
            res.status(401).json({ error: 'Utilisateur non authentifié' });
            return;
        }

        const { title } = req.body;

        if (!title || typeof title !== 'string') {
            res.status(400).json({ error: 'Le titre du film est requis et doit être une chaîne de caractères.' });
            return;
        }

        const deletedMovie = await Movie.findOneAndDelete({ title });
        if (!deletedMovie) {
            res.status(404).json({ error: 'Film non trouvé.' });
            return;
        }

        res.status(200).json({ message: 'Film supprimé avec succès.' });
    } catch (err) {
        console.error('Erreur lors de la suppression du film:', err);
        res.status(500).json({
            error: 'Une erreur est survenue lors de la suppression du film.'
        });
    }
});

export default router;
