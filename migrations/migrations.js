var User = require('../model/user')
var UserStats = require('../model/user_stats')

module.exports = function(){
	User.find({}, function(err, data){
		if(err) { return console.log(err); }
		data.forEach(function(user){
			UserStats.findOne({user: user._id}, function(err, stats){
				if(err) { return console.log(err); }
				if(!!stats) { return; }
				new UserStats({
					user: user._id
				}).save(function(err){
					if(err) { return console.log(err); }
				})
			});
		});
	});
}
