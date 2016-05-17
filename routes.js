var User = require('./model/user');
var Level = require('./model/level');
var Difficulty = require('./model/difficulty');

var auth = require('./config/auth')(User);
var userCtrl = require('./controllers/user')(User);
var levelCtrl = require('./controllers/level')(Level);
var difficultyCtrl = require('./controllers/difficulty')(Difficulty);

module.exports = function(router){
	router.route('/users')
		.get(userCtrl.getAll)
		.post(userCtrl.save);
	router.get('/me', auth.isAuthenticated, userCtrl.me);
	router.post('/login', userCtrl.login);

	router.get('/levels/:id', levelCtrl.findOne);

	router.get('/categories', difficultyCtrl.findAll)
	router.get('/categories/:id', difficultyCtrl.findOne)
	router.get('/categories/:difficulty/levels', levelCtrl.findByDifficulty);
};
