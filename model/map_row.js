var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MapRowSchema = new mongoose.Schema({
		values: {
			type: [String],
			required: true
		},
		index: {
			type: Number,
			required: true
		}
});

module.exports = mongoose.model('MapRow', MapRowSchema);
