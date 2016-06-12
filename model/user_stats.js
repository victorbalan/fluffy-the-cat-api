var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserStatsSchema = new mongoose.Schema({
		user: {
				type: Schema.Types.ObjectId,
				required: true,
				unique: true,
				ref: 'User'
		},
		lives: {
			type: Number,
			default: 9
		}
});

module.exports = mongoose.model('UserStats', UserStatsSchema);
