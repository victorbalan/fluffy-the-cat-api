var Level = require('../model/level');

module.exports = function () {
    function getAllLevels(req, res) {
        Level.find().sort('difficulty').sort('subDifficulty').select('_id difficulty subDifficulty').exec(function (err, levels) {
            res.send(levels);
        });
    }

		function findOne(req, res){
			Level.findOne({_id: req.params.id}, function(err, data){
				if(err){ return res.send(500);}
				res.send(data);
			});
		}

    function getNextLevel(req, res) {
        var currentDifficulty = req.query.difficulty;
        var currentSubDifficulty = req.query.subDifficulty;

        Level.findOne({
            $or: [
                {
                    $and: [
                        {difficulty: {$eq: currentDifficulty}},
                        {subDifficulty: {$gt: currentSubDifficulty}}
                    ]
                },
                {
                    $and: [
                        {difficulty: {$gt: currentDifficulty}},
                        {subDifficulty: {$eq: 1}}
                    ]
                }
            ]

        }).sort('difficulty').sort('subDifficulty').exec(function (err, level) {
            if (!level)
                res.send('ai terminat coae, bravo');
            else
                res.send(level);
        });
    }

    return {
        getNextLevel: getNextLevel,
        getAllLevels: getAllLevels,
				findOne: findOne
    }
};
