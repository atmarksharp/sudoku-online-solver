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

  function setValue(x,y,val){
    var $target = $("[class='sudoku-cell'][data-x='"+x+"'][data-y='"+y+"']");
    var dx = $target.attr("data-x");
    var dy = $target.attr("data-y");

    // console.log("setValue x: "+x+", y: "+y+"");
    $text = $target.find('.sudoku-cell-text');
    $text.val(val);
    questions.push({x:x, y:y, val:val});
  }

  function setFinalResultValue(x,y,val){
    var $target = $('#popup').find(".sudoku-cell[data-x='"+x+"'][data-y='"+y+"']");
    var dx = $target.attr("data-x");
    var dy = $target.attr("data-y");

    // console.log("setValue x: "+x+", y: "+y+"");
    $text = $target.find('.sudoku-cell-text');
    $text.val(val);
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
    console.log("inner_count: "+inner_count);

    var $inner_tr;

    for(var i = 0; i<inner_count*inner_count; i++) {
      var table_x = (i%inner_count);
      var table_y = parseInt(i/inner_count);
      var cell_text_size = cell_size - 4;

      console.log("table-x: "+table_x+", table-y: "+table_y+"");

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

  function setSudokuSample(){
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

  if(typeof window != 'undefined'){
    window.setSudokuSample = setSudokuSample;
  }

  function updateCallback(){
    $cell = $('.sudoku-cell');

    $cell.change(function(){
      var $this = $(this);
      var $text = $(this).find(".sudoku-cell-text");

      var x = $this.attr("data-x");
      var y = $this.attr("data-y");
      var val = parseInt($text.val());

      questions.push({x:x, y:y, val:val});
      console.log("x: "+x+", y: "+y+", val: "+val+"");
    });
  }

  function generateSudoku(){
    questions = [];
    answers = [];

    $sudoku.html("");
    $outer_table = $("<table class=\"sudoku-table\" cellspacing=\"0\" cellpadding=\"0\"></table>");

    var inner_count = parseInt(size/group_size);
    console.log("inner_count: "+inner_count);

    var $inner_tr;

    for(var i = 0; i<inner_count*inner_count; i++) {
      var table_x = (i%inner_count);
      var table_y = parseInt(i/inner_count);
      var cell_text_size = cell_size - 4;

      console.log("table-x: "+table_x+", table-y: "+table_y+"");

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
    function solved(answers){
      generateFinalResult();
      showResultData(answers);

      $('#popup').hide().fadeIn(600);
      $('#close-popup').click(function(){
        $('#popup').fadeOut(500);
      });

      console.log("solved!");
    }
    solve_sudoku(questions, size, cell_size, solved); // in sudoku-solver.js
  });

  generateSudoku();
});
