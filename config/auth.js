var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy

module.exports = function(User, Game, Level){
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

	function canAccessLevel(req, res, next){
		console.log(req.user._id, 'is trying to access', req.params.id);
		Game.findOne({user: req.user._id, level: req.params.id}, function(err, data){
			if(err){ return res.status(500).json(err);}
			if(!data) { return res.status(400).json({message: 'You cannot access this level'}); }
			next();
		});
	}

	function canStartGame(req, res, next){
		Level.findOne({_id: req.params.id}).populate('difficulty').exec(function(err, level){
			if(err){ return res.status(500).json(err);}
			var prevSubDif = level.subDifficulty - 1;
			var prevDif = -1;
			if(prevSubDif < 1){
				prevDif = level.difficulty.value - 1;
				next();
				return;
			}
			Level.findOne({subDifficulty: prevSubDif, difficulty: level.difficulty}, function(err, prevLevel){
				if(err){ return res.status(500).json(err);}
				Game.findOne({user: req.user._id, level: prevLevel._id, completedAt: {'$ne': null}}, function(err, data){
					if(err){ return res.status(500).json(err);}
					if(!data) { return res.status(400).json({message: 'You have not completed the previous level yet'}); }
					next();
				});
			});
		});
	}

	return {
		isAuthenticated: passport.authenticate(['bearer'], {session: false}),
		isAdmin: passport.authenticate(['bearer-admin'], {session: false}),
		canAccessLevel: canAccessLevel,
		canStartGame: canStartGame
	}
}
