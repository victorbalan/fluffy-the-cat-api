var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy

module.exports = function(User, Client, Token){
	passport.use(new BearerStrategy(
		function(accessToken, callback){
			User.findOne({token: accessToken}, function(err, user){
				if(err) { return callback(err); }
				if(!user) { return callback(null, false); }
				callback(null, user);
			});
		}
	));

	passport.use('bearer-admin', new BearerStrategy(
		function(accessToken, callback){
			User.findOne({token: accessToken}, function(err, user){
				if(err) { return callback(err); }
				if(!user) { return callback(null, false); }
				// hardcode shit
				if(user.email !== 'vbalan') { return callback(null, false); }
				callback(null, user);
			});
		}
	));

	return {
		isAuthenticated: passport.authenticate(['bearer'], {session: false}),
		isAdmin: passport.authenticate(['bearer-admin'], {session: false})
	}
}
