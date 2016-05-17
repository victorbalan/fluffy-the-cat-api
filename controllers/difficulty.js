module.exports = function (Difficulty) {
	function processResponse(res, err, data){
		if(err){ return res.status(500).json(err);}
		res.send(data);
	}

	function findAll(req, res) {
		Difficulty.find(function(err, data){
			processResponse(res, err, data);
		});
	}

	function findOne(req, res){
		Difficulty.findOne({_id: req.params.id}, function(err, data){
			processResponse(res, err, data);
		});
	}

	return {
		findAll: findAll,
		findOne: findOne
	}
};
