var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LevelSchema = new mongoose.Schema({
	difficulty: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'Difficulty'
	},
	prev: {
		type: Schema.Types.ObjectId,
		unique: true,
		ref: 'Level'
	},
	subDifficulty: {
		type: Number,
		required: true,
		unique: false
	},
	map: {
		type: [{
			type: Schema.Types.ObjectId,
			ref: 'MapRow'
		}],
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
