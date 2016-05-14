var mongoose = require('mongoose');

var LevelSchema = new mongoose.Schema({
    difficulty: {
        type: Number,
        required: true,
        unique: false
    },
    subDifficulty: {
        type: Number,
        required: true,
        unique: false
    },
    map: {
        type: String,
        required: true,
        unique: true
    },
    levelKey: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date
    }
});

module.exports = mongoose.model('Level', LevelSchema);
