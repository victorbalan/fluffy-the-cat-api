
exports.process = function(level){
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
				default:
					pl[i][j] = level[i][j] + '-' + getGroundType(level, i, j);
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
