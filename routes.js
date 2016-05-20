var User = require('./model/user');
var Level = require('./model/level');
var Game = require('./model/game');
var Difficulty = require('./model/difficulty');

var auth = require('./config/auth')(User);
var userCtrl = require('./controllers/user')(User);
var levelCtrl = require('./controllers/level')(Level);
var difficultyCtrl = require('./controllers/difficulty')(Difficulty);
var gameCtrl = require('./controllers/game')(Game);

module.exports = function(router){
	router.route('/users')
		.get(userCtrl.getAll)
		.post(userCtrl.save);
	router.get('/me', auth.isAuthenticated, userCtrl.me);
	router.post('/login', userCtrl.login);
	router.put('/token/refresh', userCtrl.refreshFacebookToken);

	router.get('/levels/:id', auth.isAuthenticated, levelCtrl.findOne);
	router.put('/levels/:level/start', auth.isAuthenticated, gameCtrl.start);

	router.get('/categories', auth.isAuthenticated, difficultyCtrl.findAll)
	router.get('/categories/:id', auth.isAuthenticated, difficultyCtrl.findOne)
	router.get('/categories/:difficulty/levels', auth.isAuthenticated, levelCtrl.findByDifficulty);
};
