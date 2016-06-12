var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var cors = require('cors');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(passport.initialize());
app.use(cors());

if(process.env.ENV==='dev'){
	mongoose.connect('mongodb://localhost:27017/fluffy-the-cat');
	require('./config/bootstrap.js')();
	require('./migrations/migrations.js')();
}else {
	mongoose.connect('mongodb://admin:admin@ds021922.mlab.com:21922/fluffy-the-cat');
}

var router = express.Router();
require('./routes')(router);
app.use('/', router);

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});
