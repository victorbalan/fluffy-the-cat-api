var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
	token: {
		type: String
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date
	}
});

UserSchema.pre('save', function(callback){
	var user = this;
	if(!user.createdAt){
		user.createdAt = new Date();
	}

	if(!user.isModified('password')) return callback();

	bcrypt.genSalt(5, function(err, salt){
		if(err) return callback(err);
		bcrypt.hash(user.password, salt, null, function(err, hash){
			if(err) return callback(err);
			user.password = hash;
			callback();
		});
	});
});

UserSchema.methods.verifyPassword = function(password, callback){
	bcrypt.compare(password, this.password, function(err, isMatch){
		if(err) return callback(err);
		callback(null, isMatch);
	});
}

UserSchema.methods.refreshToken = function(){
	this.token = uid(64);
	return this.token;
}


function uid (len) {
	var buf = []
	, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	, charlen = chars.length;

	for (var i = 0; i < len; ++i) {
		buf.push(chars[getRandomInt(0, charlen - 1)]);
	}

	return buf.join('');
};

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


module.exports = mongoose.model('User', UserSchema);
