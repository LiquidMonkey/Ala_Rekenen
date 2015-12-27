$(document).ready(function(){
  initButtons();
  openTables($("#lowestTable").val(), $("#highestTable").val());

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

    openTables(low, high);//opens the tables x till and including y
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
    slideView('-= 360px')
  });
  $("#navDown").click(function(){
    slideView('+= 360px')
  });
}

function animateDivSize(size) {
  $('#tableContainer').animate( {'height' : size} );
}

function slideView(size) {
  $('#tableContainer').animate( {'top' : size} );
}

var highestTable = 10;
var highestMultiplyer = 10;

function openTables( low, high ){
  var id;
  var startingTable = parseInt(low);
  highestTable = parseInt(high);//this variable has been initialized above the initTables function

  var containerContent = $("#tableContainer");
  containerContent.contents().remove();//empty the container

  for(var tableNumber = startingTable; tableNumber < highestTable+1; tableNumber++){
    containerContent.append("<table id='tableOf" + tableNumber + "'> <tbody></tbody></table>");
    for(var tableMultiplyer = 1; tableMultiplyer < highestMultiplyer+1; tableMultiplyer++){
      id = "tableOf" + tableNumber;
      var htmlString = "<tr class='"+ tableNumber +"'> <td> " + tableNumber + " </td> <td> x </td> <td> " + tableMultiplyer + " </td> <td>=</td> <td>" + tableNumber*tableMultiplyer + "</td> </tr>";
      $("#"+id+" tbody").append(htmlString);
    }
  }
}
