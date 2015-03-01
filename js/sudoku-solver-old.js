(function(G){
	function returnError(){
		throw "could not solved";
	}

	function makeArray(size,value){
		var val = value || null;
		var arr = [];
		for (var i = 0; i < size; i++) {
			arr.push(value);
		}
		return arr;
	}

	function get(x,y,board){
		return board[y][x];
	}

	function set(x,y,v,board){
		board[y][x] = v;
	}

	function makeBoard(questions, size){
		var board = [];
		for (var i = 0; i < size; i++) {
			var arr = makeArray(size,0);
			board.push(arr);
		}

		if(questions != null && questions.length != 0){
			for (var i = 0; i < questions.length; i++) {
				var e = questions[i];
				var x = e['x'];
				var y = e['y'];
				var v = e['val'];
				set(x, y, v, board);
			}
		}

		return board;
	}

	var curr = 3.73;
	var past = 2.123;
	function getRandomValue(max){
			curr = (curr - past)%max;
			return Math.abs(Math.round(curr));
	}

	function setTempValues(board, ques_board, seed){
		var size = ques_board.length;
		var stocks = [];

		for (var x = 0; x < size; x++) {
			stocks = [];
			for (var y = 0; y < size; y++) {
				var ques_board_val = get(x,y,ques_board);
				if(ques_board_val == 0){
					var v;
					while(true){
						v = getRandomValue(size);
						if(findValue(stocks,v) === false){
							break;
						}
					}
					set(x,y,v,board);
				}else{
					set(x,y,ques_board_val,board);
				}
			}
		}
	}

	var useIndexOf = 999;
	function findValue(arr,val){
		if(useIndexOf === 999){
			if(typeof [].indexOf == 'undefined'){
				useIndexOf = false;
			}else{
				useIndexOf = true;
			}
		}

		if(useIndexOf === true){
			return arr.indexOf(val) > -1;
		}else{
			for (var i = 0; i < arr.length; i++) {
				if(arr[i] === val){
					return true;
				}
			}
			return false;
		}
	}

	function checkVertical(board,size){
		var arr = [];

		for (var x = 0; x < size; x++) {
			for (var y = 0; y < size; y++) {
				var v = get(x,y,board);
				if(!(v <= size && v > 0)){
					return false;
				}
				if(findValue(arr,v)){
					return false;
				}
				arr.push(v);
			}
			arr = [];
		}

		return true;
	}

	function checkHorizontal(board,size){
		var arr = [];

		for (var y = 0; y < size; y++) {
			for (var x = 0; x < size; x++) {
				var v = get(x,y,board);
				if(!(v <= size && v > 0)){
					return false;
				}
				if(findValue(arr,v)){
					return false;
				}
				arr.push(v);
			}
			arr = [];
		}

		return true;
	}

	function checkBoxes(board,size,cell_size){
		var arr = [];
		var n = parseInt(size/cell_size);

		for (var nx = 0; nx < n; nx++) {
			for (var ny = 0; ny < n; ny++) {
				for (var y = 0; y < cell_size; y++) {
					for (var x = 0; x < cell_size; x++) {
						var v = get(x + nx*cell_size,y + ny*cell_size,board);
						if(!(v <= size && v > 0)){
							return false;
						}
						if(findValue(arr,v)){
							return false;
						}
						arr.push(v);
					}
				}
				arr = [];
			}
		}

		return true;
	}

	function checkSolved(board,cell_size){
		var size = board.length;
		return checkVertical(board,size) && checkHorizontal(board,size) && checkBoxes(board,size,cell_size);
	}

	function getLines(n){
		var s = "";
		for (var i = 0; i < n; i++) {
			if(i==0){
				s += "+-+"
			}else{
				s += "-+";
			}
		}
		return s+"\n";
	}

	function printBoard(board){
		var size = board.length;
		var lines = getLines(size);
		var res = "\n";
		var values = [];

		res += lines;

		for (var y = 0; y < size; y++) {
			for (var x = 0; x < size; x++) {
				var v = get(x,y,board);
				values[x] = v;
			}

			res += ("|" + values.join("|") + "|\n")
			res += lines;
		}

		console.log(res);
	}

	function solveBoard(board, questions, cell_size, callback){
		var ques_len = questions.length;
		var size = board.length;
		var tmp = makeBoard(null,size);

		function solveImpl(i,callback){
			setTempValues(tmp,board,i); // overwrite to tmp
			// console.log("try "+i+": "+tmp[0].join(",")+"");

			if(checkSolved(tmp,cell_size)){
				printBoard(tmp);
				callback(tmp);
			}else{
				setTimeout(function(){
					solveImpl(i,callback);
				},200);
			}
		}

		for (var i = 0; i < 1e8; i++) {
			var v = solveImpl(i,callback);
		}

		returnError();
	}

	function solve_sudoku(questions, size, cell_size){
		if(questions == null || questions.length == 0){
			returnError();
		}
		var board = makeBoard(questions, size);
		printBoard(board);

		var result = solveBoard(board, questions, cell_size);
		console.log(result);
		return result;
	}

	G.solve_sudoku = solve_sudoku;
})(this);
