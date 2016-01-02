$(document).ready(function(){
  initButtons();
  //var tableRow = "<tr class='"+ tableNumber +"'> <td> " + tableNumber + " </td> <td> x </td> <td> " + tableMultiplyer + " </td> <td>=</td> <td>" + tableNumber*tableMultiplyer + "</td> </tr>";

  var tableRow ="<tr class='?'> <td>?</td> <td>x</td> <td>?</td> <td>=</td> <td>?</td> </tr>";

  var low = $("#lowestTable").val();
  var high = $("#highestTable").val();

  var target = $("#tableContainer");
  openTables(low, high, tableRow, target);

  var tableRow2 ="<tr class='?'> <td>?</td> <td>x</td> <td>?</td> <td>=</td> <td data-answer='?'><input class='answer' type='number' value='0' min='0'/></td> </tr>";
  var target2 = $("#practiceTables");
  openTables(low, high, tableRow2, target2);

  preventEmptyInput();

  //doesnt work!!!! supposed to make sure the highestTable input value is never lower then the lowestTable value
  var spinner = document.getElementById('lowestTable');
  spinner.stepUp = function(num){
    if( this.value != document.getElementById('highestTable').value ){
      this.value += num;
    }
  };
});

function initButtons(){
  //following button opens the tables if the standard values of the spinners has been changed
  $("#openTables").click(function(){
    var low = $("#lowestTable").val();//gets the value of the element with the id #lowestTable
    var high = $("#highestTable").val();//gets the value of the element with id #highestTable

    openTables(low, high, tableRow);//opens the tables x till and including y
  });

  var onOff = false;
  $("#toggleDiv").click(function(){
    if(onOff == false){
      $(this).val("Collapse");
      animateDivSize('+=' + $(window).height() + 'px');
      onOff = true;
    } else {
      $(this).val("Expand");
      animateDivSize('-=' + $(window).height() + 'px');
      onOff = false;
    }
  });
  //nav for tables #tableContainer
  $("#navUp").click(function(){
    animateDivSize('-=355px');
  });
  $("#navDown").click(function(){
    animateDivSize('+=355px');
  });

  $("#checkOefenen").click(function(){
    var inputs = $("input[class~=answer]");
    jQuery.makeArray(inputs).forEach(function(entry){
      if( $(entry).val() == $(entry.parentElement).data("answer") ){
        $(entry).removeClass("wrong");
        $(entry).addClass("correct");
      } else {
        $(entry).removeClass("correct");
        $(entry).addClass("wrong");
      }
    });
  });
}

function animateDivSize(size) {
  $('#tableContainer').animate( {'height' : size} );
}

var highestTable = 10;
var highestMultiplyer = 10;
var id = 0;
function openTables( low, high, tableRow, target){
  var ident;
  var startingTable = parseInt(low);
  highestTable = parseInt(high);//this variable has been initialized above the initTables function

  target.contents().remove();//empty the container

  for(var tableNumber = startingTable; tableNumber < highestTable+1; tableNumber++){
	  id++;
    target.append("<table id='tableOf" + id + "'> <tbody></tbody></table>");
    for(var tableMultiplyer = 1; tableMultiplyer < highestMultiplyer+1; tableMultiplyer++){
	    ident = "tableOf" + id;
      var transformedRow = transformString(tableNumber, tableMultiplyer, tableRow);
      $("#"+ident+" tbody").append(transformedRow);
    }
  }
}

function transformString(tableNumber, tableMultiplyer, tableRow){
  var splitString = tableRow.concat().split('?');
  var newString = "";
  newString = splitString[0] + tableNumber + splitString[1] + tableNumber + splitString[2] + tableMultiplyer + splitString[3] + (tableNumber*tableMultiplyer) + splitString[4];
  return newString;
}

function preventEmptyInput(){
	$("input").on("keyup", function(){
		var check;
		if( $(this).val() != "" ){
			check = $(this).val();
		} else {
			check = false;
		}

		if( check === false ){
			$(this).val(0);
		}
	});
}
