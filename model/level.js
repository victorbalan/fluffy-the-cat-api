var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LevelSchema = new mongoose.Schema({
	difficulty: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'Difficulty'
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
