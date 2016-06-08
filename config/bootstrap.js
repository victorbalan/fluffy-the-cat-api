var Level = require('../model/level');
var MapRow = require('../model/map_row');
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
		var levelMap = mapProcessingService.process(JSON.parse(fs.readFileSync(prefix + filenames[index])));
		var subDifficulty = filenames[index].split('.')[0];
		var levelKey = difficulty.value + "-" + subDifficulty;
		saveMapRows(levelMap, 0, [], function(rows){
			var toSave = {
				difficulty: difficulty._id,
				subDifficulty: subDifficulty,
				map: rows,
				levelKey: levelKey,
				prev: prev,
				createdAt: new Date()
			};
			println('saving ' + levelKey);
			Level.findOneAndUpdate({levelKey: levelKey}, toSave, {upsert: true, new: true}, function (err, level) {
				if(err){ println(toSave); return println(err);}
				if(!level){
					return println('!!!!!!!!!!BAD: no difficulty was saved/updated')
				}
				recursiveSaveLevels(prefix, filenames, index + 1, difficulty, level._id, callback);
			});
		});
	}

	function saveMapRows(levelMap, rowIndex, rows, callback){
		if(!levelMap || rowIndex === levelMap.length){
			return callback(rows);
		}
		var mapRow = new MapRow({
			values: levelMap[rowIndex],
			index: rowIndex
		});
		mapRow.save(function(err){
			if(err) { println(mapRow);  return println(err); }
			rows.push(mapRow._id);
			saveMapRows(levelMap, rowIndex + 1, rows, callback)
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
