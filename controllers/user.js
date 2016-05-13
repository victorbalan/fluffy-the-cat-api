module.exports = function(User){
	function save(req, res) {
		var user = new User(req.body);

		user.save(function(err, saved){
			if(err) { res.send(err).status(500); }
			res.json(saved);
		});
	}

	function getAll(req, res) {
		User.find().select('_id username').exec(function(err, users){
			if(err) { res.send(err).status(500); }
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

	return {
		save: save,
		getAll: getAll,
		me: me,
		login: login
	}
}
