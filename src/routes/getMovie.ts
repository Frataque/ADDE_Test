import express, { Request, Response } from 'express';
import { auth } from '../middleware';
import { Movie } from '../models/Movie';

const router = express.Router();

router.get('/movies', auth, async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.auth || !req.auth.userId) {
            res.status(401).json({ error: 'Utilisateur non authentifié' });
            return;
        }

        const userId = req.auth.userId;

        const movies = await Movie.find().lean();

        const moviesWithUserRatings = movies.map(movie => {
            const ratings = movie.ratings || [];

            const userRating = ratings.find((r: any) => r.userId?.toString() === userId);

            return {
                _id: movie._id,
                title: movie.title,
                userRating: userRating ? userRating.rating : 0
            };
        });

        res.status(200).json(moviesWithUserRatings);
    } catch (err) {
        console.error('Erreur lors de la récupération des films:', err);
        res.status(500).json({
            error: 'Une erreur est survenue lors de la récupération des films.'
        });
    }
});

export default router;
