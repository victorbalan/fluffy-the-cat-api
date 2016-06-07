var Level = require('../model/level');
var Difficulty = require('../model/difficulty');

module.exports = function () {
	const fs = require('fs');
	const path = require('path');
	const levelsDir = process.cwd() + '/levels/';
	console.log(levelsDir);
	getDirectories(levelsDir).forEach(function (dir) {
		var difficulty = dir.split('.')[0];
		var difficultyLabel = '5x5';
		switch(difficulty){
			case '2':
			difficultyLabel = '10x10';
			break;
			case '3':
			difficultyLabel = '15x15';
			break;
		}
		// TODO save textures per difficulty
		var difDb = new Difficulty({
			value: difficulty,
			label: difficultyLabel,
			createdAt: new Date()
		});
		difDb.save();
		readFiles(levelsDir + dir + '/', onFileContent, onError, difDb);
	});

	function processLevel(level){
		var pl = new Array();
		for (var i = 0; i < level.length; i++) {
			pl.push(new Array(level[i].length));
			for (var j = 0; j < level[i].length; j++) {
				switch (level[i][j]) {
					case 0:
						pl[i][j] = getGroundType(level, i, j);
						break;
					case 1:
						var value = '1';
						if (i > 0 && level[i - 1][j] != 1) {
							value = 'wb';
						}
						pl[i][j] = value;
						break;
					case -1:
						pl[i][j] = 's';
						break;
					case 2:
						pl[i][j] = 'f';
						break;
				}
			}
		}
		return pl;
	}

	function getGroundType(level, i, j) {
		// t - top
		// b - bot
		// l - left
		// r - right
		// eg. tlr is a road where you can go top, left and right -> _|_
		// eg. tl -> _|
		var typesmap = {
			'1111': 'all',
			'1110': 'tbl',
			'1101': 'tbr',
			'1100': 'ver',
			'1011': 'tlr',
			'1010': 'tl',
			'1001': 'tr',
			'1000': 'b',
			'0111': 'blr',
			'0110': 'bl',
			'0101': 'br',
			'0100': 't',
			'0011': 'hor',
			'0010': 'r',
			'0001': 'l',
			'0000': 'solo'
		};
		var top, bot, left, right;
		if (i === 0) {
			top = '0';
		}
		if (i === level.length - 1) {
			bot = '0';
		}
		if (j === 0) {
			left = '0';
		}
		if (j === level[i].length - 1) {
			right = '0';
		}
		top = !!top ? top : (level[i - 1][j] !== 1) ? '1' : '0';
		bot = !!bot ? bot : (level[i + 1][j] !== 1) ? '1' : '0';
		left = !!left ? left : (level[i][j - 1] !== 1) ? '1' : '0';
		right = !!right ? right : (level[i][j + 1] !== 1) ? '1' : '0';

		var val = typesmap[top + bot + left + right];
		if (!!val) {
			return val;
		} else {
			// this should not be possible
			return 'und';
		}
	}

	function onFileContent(filename, content, difficulty, subDifficulty) {
		console.log(filename, difficulty.value, subDifficulty);
		var jsonContent = JSON.stringify(processLevel(JSON.parse(content)));
		var level = new Level({
			difficulty: difficulty,
			subDifficulty: subDifficulty,
			map: jsonContent,
			levelKey: difficulty.value + "-" + subDifficulty,
			createdAt: new Date()
		});
		// todo save reference to prev level
		level.save(function (err, saved) {
			if (err) {
				console.log('Error saving level: ' + difficulty.value + ' : ' + subDifficulty);
				if (err.toString().indexOf('duplicate') > 0)
					console.log('It was a duplicate!');
			}
		});

	}

	function onError(err) {
		console.log(err);
	}

	function getDirectories(srcpath) {
		return fs.readdirSync(srcpath).filter(function (file) {
			return fs.statSync(path.join(srcpath, file)).isDirectory();
		});
	}

	function readFiles(dirname, onFileContent, onError, difficulty) {
		fs.readdir(dirname, function (err, filenames) {
			if (err) {
				onError(err);
				return;
			}
			filenames.forEach(function (filename) {
				if (filename.indexOf('.map') > 0) {
					var subDifficulty = filename.split('.')[0];
					console.log(difficulty.value + ' ' + subDifficulty);
					fs.readFile(dirname + filename, 'utf-8', function (err, content) {
						if (err) {
							onError(err);
							return;
						}
						onFileContent(filename, content, difficulty, subDifficulty);
					});
				}
			});
		});
	}
};
