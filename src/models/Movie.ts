import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    ratings: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 0,
            max: 5
        },
        comment: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        }
    }]
});

export const Movie = mongoose.model('Movie', movieSchema);