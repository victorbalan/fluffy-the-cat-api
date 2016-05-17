var mongoose = require('mongoose');

var DifficultySchema = new mongoose.Schema({
		value: {
				type: Number,
				unique: true,
				required: true
		},
		label: {
			type: String,
			unique: true,
			required: true
		},
		createdAt: {
				type: Date
		}
});

module.exports = mongoose.model('Difficulty', DifficultySchema);
