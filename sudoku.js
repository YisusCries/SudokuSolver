// Functional version (It solves the sudoku correctly): 19th november 2019
// More responsive and user friendly version: 
// 


// ***************
// * EVENTS ZONE *
// ***************

// Add the click event on the start button to solve the sudoku
$("#pressToSolve").click(function() {
	loadSudokuData();
	start(false);
});

// Add the click event on the start button to solve the sudoku
$("#pressToClean").click(function() {
	clearSudoku();
});

// Add onlick event to all sudoku tiles so we can put a value in it later with the options pad
$(".sudoku-tile").each(function(index, element1) {
	$(element1).click(function() {
		if ($(element1).is('#sudoku-tile-selected')) {
			$("#sudoku-tile-selected").removeAttr('id');
			$("#sudoku-options-tile-selected").removeAttr('id');
		} else {
			$("#sudoku-tile-selected").removeAttr('id');
			$(element1).attr('id', 'sudoku-tile-selected');

			if ( $(element1).html() !== "" ) {
				$(".sudoku-option-tile").each(function(index, element2) {
					if ( $(element2).html() === $(element1).html() ) {
						$("#sudoku-options-tile-selected").removeAttr('id');
						$(element2).attr('id', 'sudoku-options-tile-selected');
					}
				});
			} else {
				$("#sudoku-options-tile-selected").removeAttr('id');
			}

		}
	});
});

// Add onlick event to sudoku options so we can add a value on selected sudoku tiles
$(".sudoku-option-tile").each(function(index, element) {
	$(element).click(function() {
		if ($("#sudoku-tile-selected").html() !== undefined) {
			if ($(element).is('#sudoku-options-tile-selected')) {
				$("#sudoku-options-tile-selected").removeAttr('id');
				$("#sudoku-tile-selected").html("");
			} else {
				$("#sudoku-options-tile-selected").removeAttr('id');
				$(element).attr('id', 'sudoku-options-tile-selected');
				$("#sudoku-tile-selected").html($(element).html());
			}
		}
	});
});

// ###############################################################################################################


// ***************************************
// * INTERACTIONS WITH THE "SEEN" SUDOKU *
// ***************************************


// Create variables to save sudoku values
var row = [];
var sudoku = [];

// Function to save all the sudoku data in the array
function loadSudokuData() {
	row = [];
	sudoku = [];
	$(".sudoku-tile").each(function(index) {
		if ($(this).html() !== "") {
			$(this).addClass('user-filled');
		}

		row.push($(this));

		if ((index+1) % 9 == 0) {
			sudoku.push(row);
			row = [];
		}  
	});
}

// Function to show the sudoku solved
function showSudokuSolved() {
	var row = 0;
	var col = 0;

	$(".sudoku-tile").each(function(index, element) {
		if (col == 9) {
			col = 0;
			row++;
		}

		setTimeout(function() {
			$(element).html($(sudoku[row][col]).html());
		}, 3000);

		

		col++;
	});
}

// Function to clear sudoku
function clearSudoku() {
	row = [];
	sudoku = [];

	rowSolve = 0;
	colSolve = 0;

	$(".sudoku-tile").each(function() {
		$(this).html("");
		$(this).removeClass('user-filled');
	});
}


// ****************
// * SOLVING ZONE *
// ****************


// Variables to use when solving the sudoku (coords of the target tile)
var rowSolve = 0;
var colSolve = 0;

// Function to modify the value of the target tile, depending on which action is done (1 = move forward, -1 = move backwards)
function changeTargetTile(action) {
	switch (action) {
		case 1:
			if (colSolve+1 == 9) {
				rowSolve++;
				colSolve = 0;
			} else {
				colSolve++;
			}
			break;
		case -1:
			if (colSolve-1 == -1) {
				rowSolve--;
				colSolve = 8;
			} else {
				colSolve--;
			}
			break;
		default:
			
			break;
	}
}

function start(fromForward) {
	if (rowSolve == 9) {
		showSudokuSolved();
		return;
	} else {

		var tile = $(sudoku[rowSolve][colSolve]);
		var tileValue = tile.html();
		var isFromUser = tile.hasClass('user-filled');
		var isCorrect;

		if ( isFromUser ) {
			if (fromForward) {
				changeTargetTile(-1);
				start(true);
				return;
			} else {
				changeTargetTile(1);
				start(false);
				return;
			}
		} else {
			var startValue = 1;
			var done = false;

			if ( fromForward ) {
				if (tileValue == 9) {
					tile.html("");
					changeTargetTile(-1);
					start(true);
					return;
				} else {
					startValue = parseInt(tileValue)+1;
				}
			}

			for (var i = startValue; i <= 9 && !done; i++) {
				tile.html(i);

				if ( checkIfCorrect(rowSolve, colSolve) ) {
					isCorrect = true;
					done = true;
				} else {
					isCorrect = false;
				}
			}

			if ( isCorrect ) {
				changeTargetTile(1);
				start(false);
				return;
			} else {
				tile.html("");
				changeTargetTile(-1);
				start(true);
				return;
			}

		}
	}
}

// ***** (SUB) FUNCTIONS TO CHECK IF NUMBER IS CORRECT ON X,Y COORD *****

// Function to check if the number on x , y tile position is correct or not
function checkIfCorrect (row, col) {
	if (!checkRow(row, col) || !checkColumn(row, col) || !checkTileGroup(row, col)) {
		return false;
	} else {
		return true;
	}
}

// Function to check if the number is valid on the row
function checkRow(row, col) {
	var isOk = true;
	var tileValue = $(sudoku[row][col]).html();

	for (var i = 0; i <= 8; i++) {
		if (col != i) {
			if (tileValue == $(sudoku[row][i]).html()) {
				isOk = false;
				return isOk;
			}
		}
	}

	return isOk;
}

// Function to check if the number is valid on the column
function checkColumn(row, col) {
	var isOk = true;
	var tileValue = $(sudoku[row][col]).html();

	for (var i = 0; i <= 8; i++) {
		if (row != i) {
			if (tileValue == $(sudoku[i][col]).html()) {
				isOk = false;
				return isOk;
			}
		}
	}

	return isOk;
}

// Function to check if the number is valid on the tile group
function checkTileGroup(row, col) {
	var isOk = true;
	var tileValue = $(sudoku[row][col]).html();

	var rowMin;
	var rowMax;
	var colMin;
	var colMax;

	switch (true) {
		case (row < 3):
			rowMin = 0;
			rowMax = 2;
		break;
		case (row < 6):
			rowMin = 3;
			rowMax = 5;
		break;
		default:
			rowMin = 6;
			rowMax = 8;
		break;
	}

	switch (true) {
		case (col < 3):
			colMin = 0;
			colMax = 2;
		break;
		case (col < 6):
			colMin = 3;
			colMax = 5;
		break;
		default:
			colMin = 6;
			colMax = 8;
		break;
	}

	for (var i = rowMin; i <= rowMax; i++) {
		for (var j = colMin; j <= colMax; j++) {

			if (row != i || col != j) {
				if (tileValue == $(sudoku[i][j]).html()) {
					isOk = false;
					return isOk;
				}
			}

		}
	}


	return isOk;
}
