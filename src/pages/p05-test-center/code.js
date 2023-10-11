// https://codepen.io/azam/pen/GRRRjdL

$(document).ready(function() {


    var customCellWriter = function(column, record) {
      var html = column.attributeWriter(record),
        td = '<td';
      if (column.hidden || column.textAlign) {
        td += ' style="';
        if (column.hidden) {
          td += 'display: none;';
        }
        if (column.textAlign) {
          td += 'text-align: ' + column.textAlign + ';';
        }
        td += '"';
      }
      return td + '><div>' + html + '<\/td>';
    };


    var makeElementEditable = function(element) {
      $('div', element).attr('contenteditable', true);
      $(element).focusout(function() {
        $('div', element).attr('contenteditable', false);
      });
      $(element).keydown(function(e) {
        if (e.which == 13) {
          e.preventDefault();
          $('div', element).attr('contenteditable', false);
          $(document).focus();
        }
      });
      $('div', element).on('paste', function(e) {
        e.preventDefault();
      });
    };


    $(document).on('keypress', 'textarea#jsonDataDump', function(e) {
      e.preventDefault();
      e.stopPropagation();
    });


    $(document).on('keypress', 'textarea#excelPasteBox', function(e) {
      if (e.ctrlKey !== true && e.key != 'v') {
        e.preventDefault();
        e.stopPropagation();
      }
    });


    $(document).on('paste', 'textarea#excelPasteBox', function(e) {
      e.preventDefault();
      var cb;
      var clipText = '';
      if (window.clipboardData && window.clipboardData.getData) {
        cb = window.clipboardData;
        clipText = cb.getData('Text');
      } else if (e.clipboardData && e.clipboardData.getData) {
        cb = e.clipboardData;
        clipText = cb.getData('text/plain');
      } else {
        cb = e.originalEvent.clipboardData;
        clipText = cb.getData('text/plain');
      }
      var clipRows = clipText.split('\n');
      for (i = 0; i < clipRows.length; i++) {
        clipRows[i] = clipRows[i].split('\t');
      }
      var jsonObj = [];
      for (i = 0; i < clipRows.length - 1; i++) {
        var item = {};
        for (j = 0; j < clipRows[i].length; j++) {
          if (clipRows[i][j] != '\r') {
            if (clipRows[i][j].length !== 0) {
              item[j] = clipRows[i][j];
            }
          }
        }
        jsonObj.push(item);
      }
      $('textarea#jsonDataDump').val('');
      var tablePlaceHolder = document.getElementById('output');
      tablePlaceHolder.innerHTML = '';
      var table = document.createElement('table');
      table.id = 'excelDataTable';
      table.className = 'table';
      var header = table.createTHead();
      var row = header.insertRow(0);
      var keys = [];
      for (var i = 0; i < jsonObj.length; i++) {
        var obj = jsonObj[i];
        for (var j in obj) {
          if ($.inArray(j, keys) == -1) {
            keys.push(j);
          }
        }
      }
      keys.forEach(function(value, index) {
        var headerCell = document.createElement('th');
        headerCell.innerHTML = '<div>' + value + '<\/div>';
        $(headerCell).click(function() {
          makeElementEditable(this);
        });
        $(headerCell).keyup(function(e) {
          var ignoredClass = 'ignored';
          var ignoredAttr = 'data-attr-ignore';
          var columnCells = $('td, th', table).filter(':nth-child(' + ($(this).index() + 1) + ')');
          $(this).removeAttr(ignoredAttr);
          $(columnCells).each(function() {
            $(this).removeClass(ignoredClass);
            $(this).removeAttr(ignoredAttr);
          });
          if ($(this).is(':empty') || $(this).text().trim() === '') {
            $(this).attr(ignoredAttr, '');
            $(columnCells).each(function() {
              $(this).addClass(ignoredClass);
              $(this).attr(ignoredAttr, '');
            });
          }
        });
        var cell = row.insertCell(index);
        cell.parentNode.insertBefore(headerCell, cell);
        cell.parentNode.removeChild(cell);
      });
      tablePlaceHolder.appendChild(table);
      var excelDynaTable = $('table#excelDataTable').dynatable({
        features: {
          paginate: false,
          search: false,
          recordCount: true,
          sort: false
        },
        dataset: {
          records: jsonObj
        },
        writers: {
          _cellWriter: customCellWriter
        }
      });
      $(document).on('click', 'table#excelDataTable td', function() {
        makeElementEditable(this);
      });
    });


    jQuery.fn.pop = [].pop;
    jQuery.fn.shift = [].shift;


    $(document).on('click', 'button#exportJsonData', function() {
      var $rows = $('table#excelDataTable').find('tr:not(:hidden)');
      var headers = [];
      var data = [];

      
      $($rows.shift()).find('th:not(:empty):not([data-attr-ignore])').each(function() {
        console.log('[' + $(this).text().toLowerCase() + ']');
        headers.push($(this).text().toLowerCase());
      });
      $rows.each(function() {
        var $td = $(this).find('td:not([data-attr-ignore])');
        var h = {};
        headers.forEach(function(header, i) {
          h[header] = $td.eq(i).text();
        });
        data.push(h);
      });
      var jsonString = JSON.stringify(data, null, 2);
      $('textarea#jsonDataDump').val(jsonString);
      console.log(jsonString);
    });
  });