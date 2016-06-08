
module.exports = function (Level) {
	function processResponse(res, err, data){
		if(err){ return res.status(500).json(err);}
		res.send(data);
	}

	function findOne(req, res){
		Level.findOne({_id: req.params.id})
			.populate({path: 'map', options: {sort: {index: 'asc'}}}).exec(function(err, data){
			for(var i = 0; i < data.map.length; i++){
				data.map[i] = data.map[i].values;
			}
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
