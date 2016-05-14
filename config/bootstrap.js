var Level = require('../model/level');

module.exports = function () {
    const fs = require('fs');
    const path = require('path');
    const levelsDir = process.cwd() + '/levels/';
    console.log(levelsDir);
    getDirectories(levelsDir).forEach(function (dir) {
        var difficulty = dir.split('.')[0];
        readFiles(levelsDir + dir + '/', onFileContent, onError, difficulty);
    });

    function onFileContent(filename, content, difficulty, subDifficulty) {
        console.log(filename, difficulty, subDifficulty);
				var jsonContent = JSON.stringify(JSON.parse(content));
				console.log(jsonContent)
        var level = new Level({
            difficulty: difficulty,
            subDifficulty: subDifficulty,
            map: jsonContent,
            levelKey: difficulty + "-" + subDifficulty,
            createdAt: new Date()
        });
        level.save(function (err, saved) {
            if (err) {
                console.log('Error saving level: ' + difficulty + ' : ' + subDifficulty);
                if (err.toString().indexOf('duplicate') > 0)
                    console.log('It was a duplicate!');
            }
        });
        console.log(level);

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
                    var subdifficulty = filename.split('.')[0];
                    console.log(difficulty + ' ' + subdifficulty);
                    fs.readFile(dirname + filename, 'utf-8', function (err, content) {
                        if (err) {
                            onError(err);
                            return;
                        }
                        onFileContent(filename, content, difficulty, subdifficulty);
                    });
                }
            });
        });
    }
};
