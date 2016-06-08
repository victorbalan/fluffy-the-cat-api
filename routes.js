var User = require('./model/user');
var Level = require('./model/level');
var Game = require('./model/game');
var Difficulty = require('./model/difficulty');
var fs = require('fs');

var auth = require('./config/auth')(User, Game, Level);
var userCtrl = require('./controllers/user')(User);
var levelCtrl = require('./controllers/level')(Level);
var difficultyCtrl = require('./controllers/difficulty')(Difficulty);
var gameCtrl = require('./controllers/game')(Game);

var mapProcessingService = require('./services/mapProcessingService');

module.exports = function(router){
	router.route('/users')
		.get(userCtrl.getAll)
		.post(userCtrl.save);
	router.get('/me', auth.isAuthenticated, userCtrl.me);
	router.post('/login', userCtrl.login);
	router.put('/token/refresh', userCtrl.refreshFacebookToken);

	router.get('/levels/:id', auth.isAuthenticated, auth.canAccessLevel, levelCtrl.findOne);
	router.put('/levels/:id/start', auth.isAuthenticated, auth.canStartGame, gameCtrl.start);

	router.get('/categories', auth.isAuthenticated, difficultyCtrl.findAll)
	router.get('/categories/:id', auth.isAuthenticated, difficultyCtrl.findOne)
	router.get('/categories/:difficulty/levels', auth.isAuthenticated, levelCtrl.findByDifficulty);

	router.put('/games/:id/finish', auth.isAuthenticated, gameCtrl.finish)
	router.get('/games', auth.isAuthenticated, gameCtrl.myCompletedGames)

	router.get('/levelsmap', function(req, res){
		Level.find().populate('difficulty').select('-map').exec(function(err, data){
			if(err){ return res.status(500).json(err);}
			data.sort(function(a, b){
				if(a.difficulty.value !== b.difficulty.value){
					return a.difficulty.value - b.difficulty.value
				}
				return a.subDifficulty - b.subDifficulty;
			});
			fs.readFile('levels/selection.map', 'utf-8', function (err, content) {
				if(err){ return res.status(500).json(err);}
				var levelMap = mapProcessingService.process(JSON.parse(content));
				for(var i=0;i<levelMap.length;i++){
					for(var j=0;j<levelMap[i].length;j++){
						if(typeof levelMap[i][j] === 'string' && levelMap[i][j].charAt(0)==='l'){
							var counter = parseInt(levelMap[i][j].substring(1, levelMap[i][j].indexOf('-')));
							var groundType = levelMap[i][j].substring(levelMap[i][j].indexOf('-') + 1, levelMap[i][j].length);
							levelMap[i][j] = data[counter].toObject();
							levelMap[i][j].groundType = groundType;
						}
					}
				}
				res.json(levelMap);
			});
		});
	});
};
