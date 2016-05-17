var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GameSchema = new mongoose.Schema({
		user: {
				type: Schema.Types.ObjectId,
				required: true,
				ref: 'User'
		},
		level: {
				type: Schema.Types.ObjectId,
				required: true,
				ref: 'Level'
		},
		completedAt: {
				type: Date
		},
		createdAt: {
				type: Date
		}
});

GameSchema.pre('save', function(callback){
	var game = this;
	if(!game.createdAt){
		game.createdAt = new Date();
	}
	callback();
});

module.exports = mongoose.model('Game', GameSchema);
