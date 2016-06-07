var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserStatsSchema = new mongoose.Schema({
		user: {
				type: Schema.Types.ObjectId,
				required: true,
				ref: 'User'
		},
		energy: {
			type: Number
		}
});

module.exports = mongoose.model('UserStats', UserStatsSchema);
