
module.exports = function (Level) {
	function processResponse(res, err, data){
		if(err){ return res.status(500).json(err);}
		res.send(data);
	}

	function findOne(req, res){
		Level.findOne({_id: req.params.id}, function(err, data){
			processResponse(res, err, data);
		});
	}

	function findByDifficulty(req, res){
		Level.find({difficulty: req.params.difficulty})
			.select('_id subDifficulty levelKey')
			.sort('subDifficulty').exec(function(err, data){
			processResponse(res, err, data);
		});
	}

	return {
			findOne: findOne,
			findByDifficulty: findByDifficulty
	}
};
