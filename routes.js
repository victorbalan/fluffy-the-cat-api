var User = require('./model/user');
var auth = require('./config/auth')(User);
var userCtrl = require('./controllers/user')(User);
var levelCtrl = require('./controllers/level')();

module.exports = function(router){
	router.route('/users')
		.get(userCtrl.getAll)
		.post(userCtrl.save);
	router.get('/me', auth.isAuthenticated, userCtrl.me);
	router.post('/login', userCtrl.login);
	router.get('/level/next', levelCtrl.getNextLevel);
	router.get('/levels', levelCtrl.getAllLevels);
	router.get('/levels/:id', levelCtrl.findOne);

	router.get('/test', function(req, res){
		res.json({message: 'Hello world!'});
	});
};
