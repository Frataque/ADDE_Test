import mongoose from 'mongoose';

const movieRatingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
}, {
    timestamps: true
});

export const MovieRating = mongoose.model('MovieRating', movieRatingSchema);