import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            auth?: { userId: string };
        }
    }
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (!token) {
            res.status(401).json({ error: 'Token manquant' });
            return;
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET doit être défini dans .env');
        }

        const decodedToken = jwt.verify(token, jwtSecret) as { userId: string };
        req.auth = { userId: decodedToken.userId };
        next();
    } catch (error) {
        console.error('Erreur lors de la vérification du token:', error);
        res.status(401).json({ error: 'Token invalide' });
    }
};
