
function _map(arr,func){
  var res = [];
  for(var key in arr){
    res[key] = func(arr[key]);
  }
  return res;
}

function _maph(arr,func){
  var res = {};
  for(var key in arr){
    res[key] = func(arr[key]);
  }
  return res;
}

function _each(arr,func){
  for(var key in arr){
    func(arr[key]);
  }
}

function _indexOf(arr,val){
  for(var key in arr){
    if(arr[key] === val){
      return key;
    }
  }
  return -1;
}

function _keyOf(hash,val){
  for(var key in hash){
    if(hash[key] === val){
      return key;
    }
  }
  return null;
}

// ===============================

function makeArray(size,value){
  var arr = [];
  for (var i = 0; i < size; i++) {
    arr.push(value);
  }
  return arr;
}

function makeRange(from, to){
  var arr = [];
  for (var i = from; i <=to; i++) {
    arr.push(i);
  }
  return arr;
}

function couldNotSolve(){
  console.log("[LOG] Could not solve");
  alert("答えを出すことが出来ませんでした。\n（ヒント：問題のミスを確認して下さい）");
  throw "Could not solve";
}

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

function checkBoxesN(nums,size,cell_size){
  var arr = [];
  var group_num = parseInt(size/cell_size);

  for (var nx = 0; nx < group_num; nx++) { // group number
    for (var ny = 0; ny < group_num; ny++) {
      for (var y = 0; y < cell_size; y++) {
        for (var x = 0; x < cell_size; x++) {
          var px = x + nx*cell_size; // nx*cell_size -> absolute pos of left
          var py = y + ny*cell_size; // ny*cell_size -> absolute pos of top
          var id = (px + py*size);
          var v = nums[id]
          /*if(!(v <= size && v > 0)){
            return false;
          }*/
          if(_indexOf(arr,v) > -1){
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

function checkHorizontalN(nums,size){
  var arr = [];

  for (var y = 0; y < size; y++) {
    for (var x = 0; x < size; x++) {
      var id = (x + y*size);
      var v = nums[id];
      /*if(!(v <= size && v > 0)){
        return false;
      }*/
      if(_indexOf(arr,v) > -1){
        return false;
      }
      arr.push(v);
    }
    arr = [];
  }

  return true;
}

function checkVerticalN(nums,size){
  var arr = [];

  for (var x = 0; x < size; x++) {
    for (var y = 0; y < size; y++) {
      var id = (x + y*size);
      var v = nums[id];
      /*if(!(v <= size && v > 0)){
        return false;
      }*/
      if(_indexOf(arr,v) > -1){
        return false;
      }
      arr.push(v);
    }
    arr = [];
  }

  return true;
}

function checkSolvedN(nums, size, cell_size){
  return checkVerticalN(nums,size) && checkHorizontalN(nums,size) && checkBoxesN(nums,size,cell_size);
}

// see http://qiita.com/minodisk/items/94b6287468d0e165f6d9
function shuffle(arr) {
  var i, j, temp;
  arr = arr.slice();
  i = arr.length;
  if (i === 0) {
    return arr;
  }
  while (--i) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
};


// function solver(seq, size, cell_size){
//   var pixel_size = size*size;
//   var group_size = Math.floor(size/cell_size);
//   var size_by_groups = size/group_size;
//   var numset = makeRange(1,size);
//
//   function updateSet(nums,id){
//     for (var i = 0; i < pixel_size; i++) {
//       if(i%size == 0){
//         numset = shuffle(numset);
//       }
//       if(seq[i] === 0 || seq[i] === '' || seq[i] === null){
//         nums[i] = numset[i%size];
//       }else{
//         nums[i] = seq[i];
//       }
//     }
//   }
//
//   function solveImpl(seq){
//     var nums = makeArray(size*size, 1);
//
//     var i=1;
//     while(true){
//       updateSet(nums,0);
//
//       if(i%100000 == 0){
//         console.log(i);
//         printSeq(nums, size);
//       }
//       if(checkSolvedN(nums, size, cell_size)){
//         return board;
//       }
//       i++;
//     }
//   }
//
//   return solveImpl(seq);
// }

// Core solver (edited by fumiya funatsu)
// see http://d.hatena.ne.jp/bellbind/20060713/1152794033

// TODO: This makes bugs

var get_y = function (id, size) {
  return (id - (id % size)) / size;
  // same as Math.floor(id/size);
};

var get_x = function (id, size) {
  return id % size;
}

var get_gx = function(x, group_size){
  get_y(x, group_size);
}

var get_gy = function(i, triple_size){
  get_y(i, triple_size);
}

var solver = function (data, size, cell_size, callback, _group_size, _size_by_groups) {
  var area_size = size*size;
  var group_row_size = size*cell_size;
  var returnflag = false;
  var returnData;
  // var size_by_groups = _size_by_groups || size/group_size;

  function impl(data){
    for (var i = 0; i < area_size; i++) { // 各ピクセルについて（●）
      if (data[i] != 0) continue; // セルの値が設定済みならスキップ
      var t = makeArray(size+1, false); // size+1のfalseで埋めた配列を作成
      var x = get_x(i,size); // 現在のx座標
      var y = get_y(i,size); // 現在のy座標
      var group_x = get_gx(x, cell_size); // ボックス自体（太線）のx座標
      var group_y = get_gy(i, group_row_size); // ボックス自体（太線）のy座標

      for (var j = 0; j < area_size; j++) { // ●に対する全ピクセルについて
        var px = get_x(j, size);
        var py = get_y(j, size);
        var p_group_x = get_gx(px, cell_size);
        var p_group_y = get_gy(j, group_row_size);

        if (true
            || py == y
            || px == x
            || (p_group_y == group_y && p_group_x == group_x))
        {
          t[data[j]] = true;
        }
      };
      for (var j = 1; j <= size; j++) { // 各値について
        if (t[j]) continue; // iとjが同じ位置ならばスキップ
        data[i] = j; // i位置のピクセルの値をj（値）に設定
        impl(data); // 同じことを繰り返す(★)
      }

      // ★の再帰から戻ったとき
      data[i] = 0; // データを0に設定
      return;
    }

    callback(data);
    return;
  }

  impl(data);
};



function makeBoard(seq, size){
  var board = [];
  for (var i = 0; i < size; i++) {
    board[i] = makeArray(size, 0);
  }

  if(seq != null){
    for (var i = 0; i < seq.length; i++) {
      var v = seq[i] || 0;
      var x = i%size;
      var y = Math.floor(i/size);

      set(x,y,v,board);
    }
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
          if(_indexOf(arr,v) > -1){
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

function checkHorizontal(board,size){
  var arr = [];

  for (var y = 0; y < size; y++) {
    for (var x = 0; x < size; x++) {
      var v = get(x,y,board);
      if(!(v <= size && v > 0)){
        return false;
      }
      if(_indexOf(arr,v) > -1){
        return false;
      }
      arr.push(v);
    }
    arr = [];
  }

  return true;
}

function checkVertical(board,size){
  var arr = [];

  for (var x = 0; x < size; x++) {
    for (var y = 0; y < size; y++) {
      var v = get(x,y,board);
      if(!(v <= size && v > 0)){
        return false;
      }
      if(_indexOf(arr,v) > -1){
        return false;
      }
      arr.push(v);
    }
    arr = [];
  }

  return true;
}

function checkSolved(board,cell_size){
  var len = board.length;
  return checkVertical(board,size) && checkHorizontal(board,size) && checkBoxes(board,len,cell_size);
}

function checkResult(board){
  var len = board.length;
  return checkVertical(board,len);
}

// Solveer entry function
function solve_sudoku(questions, size, cell_size, callback){
  if(questions == null || questions.length == 0){
    couldNotSolve();
  }
  var seq = ques2Seq(questions, size);
  // var board = makeBoard(seq, size);
  printSeq(seq, size);

  solver(seq, size, cell_size, function(res_seq){
    var result = makeBoard(res_seq,size);
    printBoard(result);

    if(checkResult(result)){
      callback(result);
    }else{
      couldNotSolve();
    }
  });
}

function printBoard(board){
  var len = board.length;
  // const lines = makeArray(size,"-").join("") + "\n";
  var res = "\n";
  var values = [];

  // res += lines;

  for (var y = 0; y < len; y++) {
    for (var x = 0; x < len; x++) {
      var v = get(x,y,board) || 0;
      values[x] = v;
    }

    res += ("|" + values.join("|") + "|\n")
    // res += lines;
  }

  console.log(res);
}

// for debug only
function printQuestion(){
  printSeq(ques2Seq(questions, size),size);
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
