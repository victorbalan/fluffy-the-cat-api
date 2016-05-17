var Level = require('../model/level');
var Difficulty = require('../model/difficulty');

module.exports = function () {
    const fs = require('fs');
    const path = require('path');
    const levelsDir = process.cwd() + '/levels/';
    console.log(levelsDir);
    getDirectories(levelsDir).forEach(function (dir) {
        var difficulty = dir.split('.')[0];
        var difDb = new Difficulty({
            value: difficulty,
            createdAt: new Date()
        });
        difDb.save();
        readFiles(levelsDir + dir + '/', onFileContent, onError, difDb);
    });

    function onFileContent(filename, content, difficulty, subDifficulty) {
        console.log(filename, difficulty.value, subDifficulty);
        var jsonContent = JSON.stringify(JSON.parse(content));
        console.log(jsonContent);

        var level = new Level({
            difficulty: difficulty,
            subDifficulty: subDifficulty,
            map: jsonContent,
            levelKey: difficulty.value + "-" + subDifficulty,
            createdAt: new Date()
        });
        level.save(function (err, saved) {
            if (err) {
                console.log('Error saving level: ' + difficulty.value + ' : ' + subDifficulty);
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
