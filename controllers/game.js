module.exports = function (Game) {
	function processResponse(res, err, data){
		if(err){ return res.status(500).json(err);}
		res.send(data);
	}

	function start(req, res) {
		new Game({
			user: req.user._id,
			level: req.params.id
		}).save(function(err, data){
			processResponse(res, err, data);
		});
	}

	function finish(req, res) {
		Game.update({_id: req.params.id, user: req.user._id},
			{completedAt: new Date()}, function(err){
				processResponse(res, err, {message: 'completed'});
		});
	}

	function myCompletedGames(req, res){
		Game.find({user: req.user._id, completedAt: {'$ne': null}})
		.select('_id level completedAt').exec(function(err, data){
			processResponse(res, err, data)
		})
	}

	function findOne(req, res){
		Difficulty.findOne({_id: req.params.id}, function(err, data){
			processResponse(res, err, data);
		});
	}

	return {
			start: start,
			finish: finish,
			myCompletedGames: myCompletedGames
	}
};
