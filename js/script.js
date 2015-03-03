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
  $file_input = $('#file-input');
  // $filetype = $('#filetype');

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

  function clearAll(){
    var map =
      [
        [_,_,_,_,_,_,_,_,_],
        [_,_,_,_,_,_,_,_,_],
        [_,_,_,_,_,_,_,_,_],
        [_,_,_,_,_,_,_,_,_],
        [_,_,_,_,_,_,_,_,_],
        [_,_,_,_,_,_,_,_,_],
        [_,_,_,_,_,_,_,_,_],
        [_,_,_,_,_,_,_,_,_],
        [_,_,_,_,_,_,_,_,_]
      ];

    setQuestionValue(map);
    return false;
  }

  function generatePuzzle(mode){
    spinner(true); // show spinner
    setTimeout(function(){

      fileInputClose();

      var puzzle = sudoku.generate(mode);
      var map = sudoku.generateMap(puzzle);

      setQuestionValue(map);

      spinner(false); // hide spinner
    }, 500);

    return false;
  }

  function spinner(true_or_false){
    if(true_or_false){
      $('#spinner').show();
    }else{
      $('#spinner').hide();
    }
  }

  function fileInputClose(mode){
    if(typeof mode === "undefined"){
      $('#file-input').hide();
    }else if(mode === "slideup"){
      $('#file-input').show().fadeOut(500);
    }
  }

  function showImportHelp(){
    alert("このサイトの出力機能を使って出力した、ファイルのインポートができます。\n\nファイルを指定の場所にドラッグ&ドロップして下さい。");
  }

  function showExportHelp(){
    alert("マス目に入力した問題をファイルに出力できます。");
  }

  function fileInput(type){
    if(typeof window.FileReader === 'undefined'){
      alert('お使いのブラウザでは「ドラッグ&ドロップ機能」が使えません。\nブラウザを更新したり、別のブラウザをお使い下さい。\n（モバイル端末はサポートしていません）')
    }

    // $filetype.val(type);
    $file_input.hide().fadeIn(500).css('display','table');
  }

  function submitPost(url,p){
    var $form = $('<form/>', {method:"post", action:url});
    var $textarea = $('<textarea hidden name="p">');
    $textarea.val(p).appendTo($form);
    $form.appendTo(document.body);
    $form.submit();
  }

  function exportFile(type){
    var filename = prompt("ファイル名を指定して下さい (拡張子は除く):", "sudoku");
    
    if(filename === null){
      return;
    }else if(/[\/@#$%^&*\(\)+=\|\\;:'",?!<>`]/.test(filename)){
      alert("【エラー】使える記号は '_' と '-' のみです");
      return;
    }else if(/(^[-])|([-]$)/.test(filename)){
      alert("【エラー】先頭と終端には '-' は使えません。");
      return;
    }

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

      submitPost("download/"+filename+".csv",csv);
    }else if(type === "json"){
      var puzzle = questionsToPuzzle(questions);
      var json = JSON.stringify(puzzle);

      submitPost("download/"+filename+".json",json);
    }
  }

  function importFile(type, str){
    if(type === 'csv'){
      var map = Papa.parse(str)['data'];

      if(map.length > 9){
        map = map.slice(0, 9);
      }

      for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
          if(map[i][j].trim() == ""){
            map[i][j] = 0;
          }else{
            map[i][j] = parseInt(map[i][j]);
          }
        };
      };

      setQuestionValue(map);
      fileInputClose();
      return false;

    }else if(type === 'json'){
      var puzzle = JSON.parse(str);
      var map = sudoku.generateMap(puzzle);
      
      setQuestionValue(map);
      fileInputClose();
      return false;
    }
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

  function dragEffectOn($panel){
    $panel.css('opacity','0.7');
  }

  function dragEffectOff($panel){
    $panel.css('opacity','1');
  }

  var reader;
  var dropFiletype;

  if(window.FileReader !== 'undefined'){
    reader = new FileReader();
  }

  reader.addEventListener('load', function(){
    var text = reader.result;
    importFile(dropFiletype, text);
  });

  $file_input.on('drop', function(e){
    e.preventDefault();
    dragEffectOff($file_input);

    var $this = $(this);
    var files = e.originalEvent.dataTransfer.files

    if(files.length == 0){
      return;
    }else{
      var file = files[0];

      if(/csv/.test(file['type'])){
        dropFiletype = 'csv';
        reader.readAsText(file);
        return;
      }else if(/json|javascript/.test(file['type'])){
        dropFiletype = 'json';
        reader.readAsText(file);
        return;
      }else{
        alert("CSVファイル、JSONファイル以外は読み込むことが出来ません");
        return;
      }
    }
  });

  $file_input.on('dragover', function(e){
    e.preventDefault();

    var $this = $(this);
    dragEffectOn($file_input);
  });

  $file_input.on('dragend dragleave', function(e){
    e.preventDefault();

    var $this = $(this);
    dragEffectOff($file_input);
  });


  $size_decide.click(function(){
    size = $size.val();
    cell_size = $cell_size.val();
    group_size = $group_size.val();
    generateSudoku();
  });

  $solve_button.click(function(){
    spinner(true); // show spinner
    setTimeout(function(){

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

      spinner(false); // hide spinner

    }, 500);
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
    window.clearAll = clearAll;
  }
});
