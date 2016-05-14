var Level = require('../model/level');

module.exports = function () {
    function getAllLevels(req, res) {
        Level.find({}, function (err, levels) {
            var levelMap = {};

            levels.forEach(function (level) {
                levelMap[level._id] = {
                    difficulty: level.difficulty,
                    subDifficulty: level.subDifficulty,
                    levelKey: level.levelKey
                };
            });

            res.send(levelMap);
        });
    }

    function getNextLevel(req, res) {
        var currentDifficulty = req.query.currentDifficulty;
        var currentSubDifficulty = req.query.currentSubDifficulty;

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
        getAllLevels: getAllLevels
    }
};
