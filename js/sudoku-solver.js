function makeArray(size,value){
  var arr = [];
  for (var i = 0; i < size; i++) {
    arr.push(value);
  }
  return arr;
}

var div = function (a, b) {
  return (a - (a % b)) / b;
};

function get(x,y,board){
  return board[y][x];
}

function set(x,y,v,board){
  board[y][x] = v;
}

function get_seq(x,y,size,seq){
  return seq[x + (size*y)];
}

function set_seq(x,y,v,size,seq){
  seq[x + (size*y)] = v;
}


// http://d.hatena.ne.jp/bellbind/20060713/1152794033
var solver = function (data, size, cell_size, callback, _group_size, _size_by_groups) {
  var pixel_size = size*size;
  var group_size = _group_size || Math.floor(size/cell_size);
  var size_by_groups = _size_by_groups || size/group_size;

  for (var i = 0; i < pixel_size; i += 1) {
    if (data[i] != 0) continue;
    var t = makeArray(size+1, false);
    var iDivOs = div(i, size);
    var iModOs = i % size;
    var iDivOsIs = div(i, size_by_groups);
    var iModOsDivIs = div(i % size, group_size);
    for (var j = 0; j < pixel_size; j += 1) {
      if (div(j, size) == iDivOs ||
          j % size == iModOs ||
          (div(j, size_by_groups) == iDivOsIs && div(j % size, group_size) == iModOsDivIs)) {
        t[data[j]] = true;
      }
    };
    for (var j = 1; j <= size; j += 1) {
      if (t[j]) continue;
      data[i] = j;
      solver(data, size, cell_size, callback, group_size, size_by_groups);
    }
    data[i] = 0;
    return;
  }

  callback(data);
};

function makeBoard(seq, size){
  var board = [];
  for (var i = 0; i < size; i++) {
    board[i] = makeArray(size, 0);
  }

  for (var i = 0; i < seq.length; i++) {
    var v = seq[i] || 0;
    var x = i%size;
    var y = Math.floor(i/size);

    set(x,y,v,board);
  }

  return board;
}

function printSeq(seq, size){
  var arr = [];
  var result = "";
  for (var i = 0; i < seq.length; i++) {
    var v = seq[i] || 0;
    var x = i%size;
    var y = Math.floor(i/size);

    arr.push(v);

    if(x == size-1){
      result += (arr.join(",")+"\n");
      arr = [];
    }
  }

  console.log("\n"+result);
}

function solve_sudoku(questions, size, cell_size, callback){
  if(questions == null || questions.length == 0){
    returnError();
  }
  var seq = ques2Seq(questions, size);
  printSeq(seq, size);

  solver(seq, size, cell_size, function(seq_data){
    var result = makeBoard(seq_data, size);
    printBoard(result);
    callback(result);
  });
}

function printBoard(board){
  var size = board.length;
  const lines = makeArray(size,"-").join("") + "\n";
  var res = "\n";
  var values = [];

  res += lines;

  for (var y = 0; y < size; y++) {
    for (var x = 0; x < size; x++) {
      var v = get(x,y,board) || 0;
      values[x] = v;
    }

    res += ("|" + values.join("|") + "|\n")
    res += lines;
  }

  console.log(res);
}

function ques2Seq(questions, size){
  var seq = makeArray(size*size,0);

  if(questions != null && questions.length != 0){
    for (var i = 0; i < questions.length; i++) {
      var e = questions[i];
      var x = parseInt(e['x']);
      var y = parseInt(e['y']);
      var v = parseInt(e['val']);
      var pos = x + (size*y);
      // console.log("pos: "+pos+", x: "+x+", y: "+y+", val: "+v+"");
      if(v != 0 && v != null){
        seq[pos] = v;
      }
    }
  }

  return seq;
}
