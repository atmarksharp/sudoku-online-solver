var size = 9;
var cell_size = 45;
var group_size = 3;

jQuery(function($){
  $size = $('#sudoku-size');
  $cell_size = $('#cell-size');
  $group_size = $('#sudoku-group-size');
  $size_decide = $('#size-decide')
  $sudoku = $('#sudoku');

  function updateCallback(){
    $cell_val = $('.sudoku-cell-text');

    $cell_val.change(function(){
      var $this = $(this);
      var x = $this.attr("data-x");
      var y = $this.attr("data-y");
      console.log("x: "+x+", y: "+y+"");
    });
  }

  function generateSudoku(){
    $sudoku.html("");
    $outer_table = $("<table class=\"sudoku-table\" cellspacing=\"0\" cellpadding=\"0\"></table>");

    var inner_count = parseInt(size/group_size);
    console.log("inner_count: "+inner_count);

    for(var i = 0; i<inner_count; i++) {
      var table_x = (i%inner_count);
      var table_y = parseInt(i/inner_count);
      var cell_text_size = cell_size - 4;

      $inner_table = $("<table class=\"sudoku-inner-table\" data-x=\""+table_x+"\" data-y=\""+table_y+"\" cellspacing=\"0\" cellpadding=\"0\"></table>");

      for(var x = 0; x<group_size; x++) {
        var $tr = $("<tr></tr>");

        for(var y = 0; y<group_size; y++) {
          var $cell = $(
            "<td class=\"sudoku-cell\" data-x=\""+(table_x+x)+"\" data-y=\""+(table_y+y)+"\" style=\"width:"+cell_size+"px; height:"+cell_size+"px;\">" +
            "<input type=\"text\" class=\"sudoku-cell-text\" style=\"width:"+cell_text_size+"px; height:"+cell_text_size+"px;\"/>" +
            "</td>");

          $tr.append($cell);
        }

        var $inner_tr;

        if(x == 0){
          $inner_tr = $("<tr></tr>");
        }

        $inner_table.append($tr);
        $inner_td = $("<td></td>");
        $inner_td.append($inner_table)
        $inner_tr.append($inner_td);

        if(x >= group_size-1){
          $outer_table.append($inner_tr);
        }
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

  generateSudoku();
});
