window.onload = function(){
  initButtons();
  initTables();
};

function initButtons(){

}

var highestTable = 10;
var highestMultiplyer = 10;

function initTables(){
  var id;

  for(var tableNumber = 1; tableNumber < highestTable+1; tableNumber++){
    document.getElementById("tableContainer").innerHTML = document.getElementById("tableContainer").innerHTML + "<table id='tableOf" + tableNumber + "'> <tbody>";
    for(var tableMultiplyer = 1; tableMultiplyer < highestMultiplyer+1; tableMultiplyer++){
      id = "tableOf" + tableNumber;
      document.getElementById( id ).firstElementChild.innerHTML = document.getElementById( id ).firstElementChild.innerHTML + "<tr class='"+ tableNumber +"'> <td> " + tableNumber + " </td> <td>x</td> <td> " + tableMultiplyer + " </td> <td>=</td> <td>" + tableNumber*tableMultiplyer + "</td> </tr>";
    }
  }
}
