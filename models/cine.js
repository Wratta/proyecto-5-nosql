const mongoose = require('mongoose');

const cineSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        location: { type: String, required: true },
        movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
    },
    {
        timestamps: true
    }
);

const Cine = mongoose.model('Cine', cineSchema);

module.exports = Cine;