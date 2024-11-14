import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Movie } from './models/Movie';
import movieRoutes from './routes/getMovie';
import signup from './routes/SignUp';
import login from './routes/login';
import rating from './routes/postRating';
import createMovie from './routes/createMovie';
import deleteMovie from './routes/deleteMovie';

dotenv.config();

const app = express();

interface MovieData {
    title: string;
}

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        await importMovies();
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const importMovies = async () => {
    try {
        const moviesPath = path.join(__dirname, '../data/movies.json');
        const moviesData = JSON.parse(fs.readFileSync(moviesPath, 'utf-8')) as MovieData[];

        const count = await Movie.countDocuments();
        if (count === 0) {
            await Movie.insertMany(moviesData.map((movie) => ({ title: movie.title, ratings: [] })));
            console.log('Movies imported successfully');
        } else {
            console.log('Movies already exist in the database');
        }
    } catch (error) {
        console.error('Error importing movies:', error);
    }
};

app.use(express.json());
app.use('/api', movieRoutes);
app.use('/api', signup);
app.use('/api', login);
app.use('/api', rating);
app.use('/api', createMovie);
app.use('/api', deleteMovie);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

const startServer = async () => {
    try {
        const port = process.env.PORT || 3000;
        await connectDB();

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error('Server startup error:', error);
        process.exit(1);
    }
};

startServer();
