var size = 9;
var cell_size = 45;
var group_size = 3;

var questions = [];
var answers = [];
var _ = null; // for questions map

jQuery(function($){
  $size = $('#sudoku-size');
  $cell_size = $('#cell-size');
  $group_size = $('#sudoku-group-size');
  $size_decide = $('#size-decide')
  $sudoku = $('#sudoku');
  $solve_button = $('#sudoku-solve');

  function xToCols(x){
    switch (x){
      case 0: return 'A';
      case 1: return 'B';
      case 2: return 'C';
      case 3: return 'D';
      case 4: return 'E';
      case 5: return 'F';
      case 6: return 'G';
      case 7: return 'H';
      case 8: return 'I';
    }
  }

  function questionsToPuzzle(questions){
    var puzzle = {};
    for (var i = 0; i < questions.length; i++) {
      var data = questions[i];
      var column = xToCols(data['x']);
      var row = parseInt(data['y']) + 1;
      var val = data['val'];

      if(val !== 0 && val !== ''){
        puzzle[column + row] = val;
      }
    }
    return puzzle;
  }

  function setValue(x,y,val){
    var $target = $("[class='sudoku-cell'][data-x='"+x+"'][data-y='"+y+"']");
    var dx = $target.attr("data-x");
    var dy = $target.attr("data-y");

    // console.log("setValue x: "+x+", y: "+y+"");
    $text = $target.find('.sudoku-cell-text');
    $text.val((val === 0)? " ": val);
    questions.push({x:x, y:y, val:val});
  }

  function setFinalResultValue(x,y,val){
    var $target = $('#popup').find(".sudoku-cell[data-x='"+x+"'][data-y='"+y+"']");
    var dx = $target.attr("data-x");
    var dy = $target.attr("data-y");

    // console.log("setValue x: "+x+", y: "+y+"");
    $text = $target.find('.sudoku-cell-text');
    $text.val( val );
    // questions.push({x:x, y:y, val:val});
  }

  function setQuestionValue(map){
    var h = map.length;
    var w = map[0].length;

    questions = [];

    for (var y = 0; y < h; y++) {
      var arr = map[y];
      for (var x = 0; x < w; x++) {
        var v = arr[x];
        if(v != '' && v != null && v > 0){
          setValue(x,y,v);
        }else{
          setValue(x,y,0);
        }
      }
    }
  }

  function showResultData(map){
    for (var y = 0; y < size; y++) {
      var arr = map[y];
      for (var x = 0; x < size; x++) {
        var v = arr[x];
        setFinalResultValue(x,y,v);
      }
    }
  }

  function generateFinalResult(){
    $('#popup').css("display","table");

    var $popup_result = $('#popup-result');
    $popup_result.html("");
    $outer_table = $("<table class=\"sudoku-table\" cellspacing=\"0\" cellpadding=\"0\"></table>");

    var inner_count = parseInt(size/group_size);
    // console.log("inner_count: "+inner_count);

    var $inner_tr;

    for(var i = 0; i<inner_count*inner_count; i++) {
      var table_x = (i%inner_count);
      var table_y = parseInt(i/inner_count);
      var cell_text_size = cell_size - 4;

      // console.log("table-x: "+table_x+", table-y: "+table_y+"");

      var $inner_table = $("<table class=\"sudoku-inner-table\" data-x=\""+table_x+"\" data-y=\""+table_y+"\" cellspacing=\"0\" cellpadding=\"0\"></table>");

      for(var y = 0; y<group_size; y++) {
        var $tr = $("<tr></tr>");

        for(var x = 0; x<group_size; x++) {
          var $cell = $(
            "<td class=\"sudoku-cell popup-data\" data-x=\""+(table_x * group_size + x)+"\" data-y=\""+(table_y * group_size + y)+"\" style=\"width:"+cell_size+"px; height:"+cell_size+"px;\">" +
            "<input type=\"text\" class=\"sudoku-cell-text\" style=\"font-size:"+(cell_text_size-10)+"px; width:"+cell_text_size+"px; height:"+cell_text_size+"px;\"/>" +
            "</td>");

          $tr.append($cell);
        }

        $inner_table.append($tr);
      }

      if(table_x == 0){
        $inner_tr = $("<tr></tr>");
      }


      var $inner_td = $("<td></td>");
      $inner_td.append($inner_table);
      $inner_tr.append($inner_td);

      if(table_x == inner_count-1){
        $outer_table.append($inner_tr);
      }
    }

    $popup_result.append($outer_table);

    // updateCallback();
  }

  // debug command
  function test(n){
    sample(n);
    $solve_button.click();
  }

  function sample(n){
    switch (n) {
      case 1:
        sample1();
        break;
      case 2:
        sample2();
        break;
    }
  }

  function sample1(){
    var map =
      [
        [_,_,_,_,5,7,4,3,_],
        [5,4,_,3,_,_,2,8,_],
        [8,3,_,4,2,6,_,_,_],
        [4,_,1,_,_,_,9,6,_],
        [6,_,8,_,_,_,7,_,3],
        [_,7,9,_,_,_,8,_,4],
        [_,_,_,5,8,3,_,2,9],
        [_,8,5,_,_,2,_,4,1],
        [_,6,3,9,1,_,_,_,_]
      ];

    setQuestionValue(map);
    return false;
  }

  function sample2(){
    var map =
      [
        [_,_,2,_,9,7,5,1,_],
        [6,7,9,5,8,_,_,2,_],
        [4,_,_,_,_,_,9,_,_],
        [5,3,6,_,_,_,_,7,2],
        [_,_,_,1,7,6,_,_,_],
        [1,4,_,_,_,_,8,6,9],
        [_,_,3,_,_,_,_,_,4],
        [_,2,_,_,6,4,7,5,8],
        [_,5,4,7,2,_,6,_,_]
      ];

    setQuestionValue(map);
    return false;
  }

  function generatePuzzle(mode){
    fileInputClose();

    var puzzle = sudoku.generate(mode);
    var map = sudoku.generateMap(puzzle);

    setQuestionValue(map);
    return false;
  }

  function fileInputClose(mode){
    if(typeof mode === "undefined"){
      $('#file-input').hide();
    }else if(mode === "slideup"){
      $('#file-input').show().fadeOut(500);
    }
  }

  function showImportHelp(){
    alert("このサイトの出力機能を使って出力した、ファイルのインポートができます。\n\nファイルを開いて、中身をそのまま貼り付けて下さい。");
  }

  function showExportHelp(){
    alert("マス目に入力した問題をファイルに出力できます。");
  }

  function fileInput(type){
    $("#filetype").val(type);
    $('#file-input').hide().fadeIn(500).css('display','table');
  }

  function submitPost(url,p){
    var $form = $('<form/>', {method:"post", action:url});
    var $textarea = $('<textarea hidden name="p">');
    $textarea.val(p).appendTo($form);
    $form.appendTo(document.body);
    $form.submit();
  }

  function exportFile(type){
    if(type === "csv"){
      var puzzle = questionsToPuzzle(questions);
      var map = sudoku.generateMap(puzzle);

      var csv = "";
      for (var y = 0; y < map.length; y++) {
        var row = map[y]
        var out = [];
        for (var x = 0; x < row.length; x++) {
          if(row[x] === 0 || row[x] === ''){
            out[x] = '""';
          }else{
            out[x] = row[x];
          }
        };
        csv += out.join(",") + "\n";
      };

      submitPost("sudoku.csv",csv);
    }else if(type === "json"){
      var puzzle = questionsToPuzzle(questions);
      var json = JSON.stringify(puzzle);

      submitPost("sudoku.json",json);
    }
  }

  function importFile(){
    var type = $('#filetype').val();

  }

  function deleteQuestion(x,y,questions){
    var id = null;
    for (var i = 0; i < questions.length; i++) {
      var e = questions[i];
      if(e['x'] == x && e['y'] == y){
        id = i;
        break;
      }
    }

    if(id !== null){
      questions.splice(id, 1); // delete id
    }
  }

  function updateCallback(){
    $cell = $('.sudoku-cell');

    $cell.change(function(){
      var $this = $(this);
      var $text = $(this).find(".sudoku-cell-text");

      var x = parseInt($this.attr("data-x"));
      var y = parseInt($this.attr("data-y"));
      var val = $text.val();

      if(val === '' || val === null || val === NaN){
        deleteQuestion(x,y,questions);
      }else{
        questions.push({x:x, y:y, val:parseInt(val)});
        // console.log("x: "+x+", y: "+y+", val: "+val+"");
      }
    });
  }

  function generateSudoku(){
    questions = [];
    answers = [];

    $sudoku.html("");
    $outer_table = $("<table class=\"sudoku-table\" cellspacing=\"0\" cellpadding=\"0\"></table>");

    var inner_count = parseInt(size/group_size);
    // console.log("inner_count: "+inner_count);

    var $inner_tr;

    for(var i = 0; i<inner_count*inner_count; i++) {
      var table_x = (i%inner_count);
      var table_y = parseInt(i/inner_count);
      var cell_text_size = cell_size - 4;

      // console.log("table-x: "+table_x+", table-y: "+table_y+"");

      var $inner_table = $("<table class=\"sudoku-inner-table\" data-x=\""+table_x+"\" data-y=\""+table_y+"\" cellspacing=\"0\" cellpadding=\"0\"></table>");

      for(var y = 0; y<group_size; y++) {
        var $tr = $("<tr></tr>");

        for(var x = 0; x<group_size; x++) {
          var $cell = $(
            "<td class=\"sudoku-cell\" data-x=\""+(table_x * group_size + x)+"\" data-y=\""+(table_y * group_size + y)+"\" style=\"width:"+cell_size+"px; height:"+cell_size+"px;\">" +
            "<input type=\"text\" class=\"sudoku-cell-text\" style=\"font-size:"+(cell_text_size-10)+"px; width:"+cell_text_size+"px; height:"+cell_text_size+"px;\"/>" +
            "</td>");

          $tr.append($cell);
        }

        $inner_table.append($tr);
      }

      if(table_x == 0){
        $inner_tr = $("<tr></tr>");
      }

      var $inner_td = $("<td></td>");
      $inner_td.append($inner_table);
      $inner_tr.append($inner_td);

      if(table_x == inner_count-1){
        $outer_table.append($inner_tr);
      }
    }

    $sudoku.append($outer_table);

    updateCallback();
  }

  $size_decide.click(function(){
    size = $size.val();
    cell_size = $cell_size.val();
    group_size = $group_size.val();
    generateSudoku();
  });

  $solve_button.click(function(){
    var puzzle = questionsToPuzzle(questions);

    var answer = sudoku.solve(puzzle);
    var map = sudoku.generateMap(answer);
    // sudoku.print(answer);

    generateFinalResult();
    showResultData(map);

    window.scrollTo(0, 0);
    $('#popup').hide().fadeIn(600);
    $('#close-popup').click(function(){
      $('#popup').fadeOut(500);
    });

    console.log("[LOG] solved!");
  });

  generateSudoku();

  if(typeof window != 'undefined'){
    window.sample1 = sample1;
    window.sample2 = sample2;
    window.test = test;
    window.generatePuzzle = generatePuzzle;
    window.fileInput = fileInput;
    window.fileInputClose = fileInputClose;
    window.showImportHelp = showImportHelp;
    window.showExportHelp = showExportHelp;
    window.exportFile = exportFile;
    window.importFile = importFile;
  }
});
