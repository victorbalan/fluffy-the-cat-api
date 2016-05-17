module.exports = function (Game) {
	function processResponse(res, err, data){
		if(err){ return res.status(500).json(err);}
		res.send(data);
	}

	function start(req, res) {
		new Game({
			user: req.user._id,
			level: req.params.level
		}).save(function(err, data){
			processResponse(res, err, data);
		});
	}

	function findOne(req, res){
		Difficulty.findOne({_id: req.params.id}, function(err, data){
			processResponse(res, err, data);
		});
	}

	return {
			start: start
	}
};
