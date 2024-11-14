import express, { Request, Response } from 'express';
import { auth } from '../middleware';
import { Movie } from '../models/Movie';

const router = express.Router();

router.post('/create_movies', auth, async (req: Request, res: Response): Promise<void> => {
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

        const existingMovie = await Movie.findOne({ title });
        if (existingMovie) {
            res.status(400).json({ error: 'Un film avec ce titre existe déjà.' });
            return;
        }

        const newMovie = new Movie({ title, ratings: [] });
        await newMovie.save();

        res.status(201).json({ message: 'Film créé avec succès.', movie: newMovie });
    } catch (err) {
        console.error('Erreur lors de la création du film:', err);
        res.status(500).json({
            error: 'Une erreur est survenue lors de la création du film.'
        });
    }
});

export default router;
