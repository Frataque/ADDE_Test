import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const router = express.Router();

router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
            return;
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
            return;
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET as string,
            { expiresIn: '30m' }
        );

        res.status(200).json({
            userId: user._id,
            token,
            message: 'Connexion réussie. Vous resterez connecté pendant 30 minutes.',
            user: {
                username: user.username,
                email: user.email
            }
        });

    } catch (err) {
        res.status(500).json({
            error: "Une erreur est survenue lors de la connexion."
        });
    }
});

export default router;
