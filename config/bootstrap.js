var Level = require('../model/level');
var Difficulty = require('../model/difficulty');
var mapProcessingService = require('../services/mapProcessingService')

module.exports = function () {
	var lastLevel;
	const fs = require('fs');
	const path = require('path');
	const levelsDir = process.cwd() + '/levels/';

	var directories = getDirectories(levelsDir);

	recursiveSaveDirectories(directories, 0, null);

	function recursiveSaveDirectories(directories, dirIndex, prevLevel){
		if(!directories || dirIndex === directories.length){
			return println('all documents updated');
		}
		var value = directories[dirIndex].split('.')[0];
		var label;
		switch(value){
			case '1':
			label = '5x5';
			break;
			case '2':
			label = '10x10';
			break;
			case '3':
			label = '15x15';
			break;
		}
		// TODO save textures per difficulty
		var toSave = {
			value: value,
			label: label,
			createdAt: new Date()
		};
		Difficulty.findOneAndUpdate({value: value}, toSave, {upsert: true, new: true}, function(err, difficulty){
			if(err){ return println(err);}
			if(!difficulty){
				return println('!!!!!!!!!!BAD: no difficulty was saved/updated')
			}
			var filenames = getFileNames(levelsDir + directories[dirIndex] + '/')
			recursiveSaveLevels(levelsDir + directories[dirIndex] + '/', filenames, 0, difficulty, prevLevel, function(prev){
				recursiveSaveDirectories(directories, dirIndex + 1, prev);
			});
		});
	}

	function recursiveSaveLevels(prefix, filenames, index, difficulty, prev, callback){
		if(!filenames || filenames.length === index){
			return callback(prev);
		}
		var levelMap = JSON.stringify(mapProcessingService.process(JSON.parse(fs.readFileSync(prefix + filenames[index]))));
		var subDifficulty = filenames[index].split('.')[0];
		var levelKey = difficulty.value + "-" + subDifficulty;
		var toSave = {
			difficulty: difficulty._id,
			subDifficulty: subDifficulty,
			map: levelMap,
			levelKey: levelKey,
			prev: prev,
			createdAt: new Date()
		};
		Level.findOneAndUpdate({levelKey: levelKey}, toSave, {upsert: true, new: true}, function (err, level) {
			if(err){ return println(err);}
			if(!level){
				return println('!!!!!!!!!!BAD: no difficulty was saved/updated')
			}
			recursiveSaveLevels(prefix, filenames, index + 1, difficulty, level._id, callback);
		});
	}

	function println(err) {
		console.log(err);
	}

	function getDirectories(srcpath) {
		return fs.readdirSync(srcpath).filter(function (file) {
			return fs.statSync(path.join(srcpath, file)).isDirectory();
		});
	}

	function getFileNames(dirname) {
		return fs.readdirSync(dirname).filter(function(filename){
			return filename.indexOf('.map') > 0;
		}).sort(function(a, b){
			return parseInt(a.substring(0, a.indexOf('.'))) - parseInt(b.substring(0, b.indexOf('.')));
		});
	}
};
