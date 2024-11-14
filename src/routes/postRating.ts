import express, { Request, Response } from 'express';
import { auth } from '../middleware';
import { Movie } from '../models/Movie';

const router = express.Router();

router.post('/movies/rating', auth, async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.auth || !req.auth.userId) {
            res.status(401).json({ error: 'Utilisateur non authentifié' });
            return;
        }

        const userId = req.auth.userId;
        const { title, rating } = req.body;

        if (typeof rating !== 'number' || rating < 0 || rating > 5) {
            res.status(400).json({ error: 'La note doit être un nombre entre 0 et 5.' });
            return;
        }

        const movie = await Movie.findOne({ title });
        if (!movie) {
            res.status(404).json({ error: 'Film non trouvé.' });
            return;
        }

        const existingRating = movie.ratings.find((r: any) => r.userId.toString() === userId);
        if (existingRating) {
            existingRating.rating = rating;
        } else {
            movie.ratings.push({ userId, rating });
        }

        await movie.save();
        res.status(200).json({ message: 'Note ajoutée, mise à jour avec succès.' });

    } catch (err) {
        console.error('Erreur lors de la mise à jour de la note du film:', err);
        res.status(500).json({
            error: 'Une erreur est survenue lors de la mise à jour de la note du film.'
        });
    }
});

export default router;
