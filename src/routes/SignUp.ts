import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User';

const router = express.Router();

router.post('/signup', async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: 'Un utilisateur avec cet email existe déjà.' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            user: {
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (err) {
        res.status(500).json({
            error: "Une erreur est survenue lors de la création de l'utilisateur."
        });
    }
});

export default router;
