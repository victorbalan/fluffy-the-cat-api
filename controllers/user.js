var https = require('https');

module.exports = function(User){
	function save(req, res) {
		User.findOne({facebookId: req.body.facebookId}, function(err, data){
			if(err) { res.status(500).send(err); }
			if(!!data){
				data.token = req.body.token;
				data.save(function(err, saved){
					if(err) { res.status(500).send(err); }
					res.json(saved);
					return;
				});
			}
			var user = new User(req.body);
			if(!user.username){
				user.username = user.email;
			}

			user.save(function(err, saved){
				if(err) { res.status(500).send(err); }
				res.json(saved);
			});
		});
	}

	function getAll(req, res) {
		User.find().select('_id username email').exec(function(err, users){
			if(err) { res.status(500).send(err); }
			res.json(users);
		});
	}

	function me(req, res) {
		// don`t expose password or token
		res.json({_id: req.user._id, username: req.user.username});
	}

	function login(req, res){
		User.findOne({email: req.body.email}, function(err, user){
			if(err) { return res.send(err); }

			if(!user) { return res.json({'message': 'User does not exist'}); }

			user.verifyPassword(req.body.password, function(err, isMatch){
				if(err) { return res.send(err); }

				if(!isMatch) { return res.json({'message': 'passwords do not match'}); }

				user.refreshToken();

				user.save(function(err){
					if(err) { return res.send(err);}
					res.json(user.token);
				});
			});
		});
	}

	// ugly code..not in the mood to write anything else :(
	function refreshFacebookToken(req, res){
		var token = req.body.token;
		User.findOne({token: token}, function(err, data){
			if(err) { res.status(500).send(err); }
			if(!!data){
				res.json({token: token});
			}
			doFacebookTokenRequest(req, res, token);
		});
	}

	function doFacebookTokenRequest(req, res, token){
		https.get('https://graph.facebook.com/me?access_token=' + token, (fbres) => {
			var data = '';
			fbres.on('data', function(chunk){
				data += chunk
			});
			fbres.on('end', function() {
				var obj = JSON.parse(data);
				User.findOne({facebookId: obj.id}, function(err, user){
					if(err) { res.status(500).send(err); }
					if(user){
						console.log('registered', user)
						user.token = token;
						user.save(function(err){
							if(err) { return res.send(err);}
							res.json({token: user.token});
						});
					}else{
						console.log('not registered')
						res.status(409).send({message: 'Not registered!'});
					}
				})
			});
		}).on('error', (err) => {
			if(err) { res.status(500).send(err); }
		});
	}
	return {
		save: save,
		getAll: getAll,
		me: me,
		login: login,
		refreshFacebookToken: refreshFacebookToken
	}
}
