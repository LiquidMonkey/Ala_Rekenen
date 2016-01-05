$(document).ready(function(){
  initButtons();
  $(".vraag").val('1 x 3');
  $(".toggleDiv").click().click();//makes sure the divs are closed

  //var tableRow = "<tr class='"+ tableNumber +"'> <td> " + tableNumber + " </td> <td> x </td> <td> " + tableMultiplier + " </td> <td>=</td> <td>" + tableNumber*tableMultiplier + "</td> </tr>";

  var tableRow ="<tr class='?'> <td>?</td> <td>x</td> <td>?</td> <td>=</td> <td>?</td> </tr>";

  var low = $("#lowestTable").val();
  var high = $("#highestTable").val();

  var target = $("#tableContainer");
  openTables(low, high, tableRow, target);

  var tableRow2 ="<tr class='toetsVraag ?'> <td>?</td> <td>x</td> <td>?</td> <td>=</td> <td data-answer='?'><input class='answer' type='number' value='0' min='0'/></td> </tr>";
  var target2 = $("#practiceTables");
  openTables(low, high, tableRow2, target2);

  preventEmptyInput();//this function prevents inputfields of the number type to be empty

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

    var tableRow = "<tr class='?'> <td>?</td> <td>x</td> <td>?</td> <td>=</td> <td>?</td> </tr>";
    var target = $("#tableContainer");

    openTables(low, high, tableRow, target);//opens the tables x till and including y
  });

  $("#oefenen, #toetsen").click(function(){
    $(this).parent().addClass("hidden").next().show();
    var soort = $(this).attr("id");
    if(soort === "oefenen"){
      soort = "Oefen toets";
    } else {
      soort = "Toets";
    }
    $("#checkToets").removeClass("hidden");
    $(this).closest("article").children("h1").text(soort).append(" <span class=\"arrow\"></span>");
  });

  $(".toggleDiv").click(function(){
    if($(this).hasClass("open") == false){
      $(this).next().fadeIn(100);
      $(this).toggleClass("open");
    } else {
      $(this).next().fadeOut(100);
      $(this).toggleClass("open");
    }
  });

  //nav for tables #tableContainer
  $("#navUp").click(function(){
    animateDivSize('-=355px');
  });
  $("#navDown").click(function(){
    animateDivSize('+=355px');
  });

  $("#checkToets").click(function(){
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

function animateDivSize(target, size) {
  $(target).animate( {'height' : size} );
}

var highestTable = 10;
var highestMultiplier = 10;
var id = 0;
function openTables( low, high, tableRow, target){
  var ident;
  var startingTable = parseInt(low);
  highestTable = parseInt(high);//this variable has been initialized above the initTables function

  target.contents().remove();//empty the container

  for(var tableNumber = startingTable; tableNumber < highestTable+1; tableNumber++){
	  id++;
    target.append("<table id='tableOf" + id + "'> <tbody></tbody></table>");
    for(var tableMultiplier = 1; tableMultiplier < highestMultiplier+1; tableMultiplier++){
	    ident = "tableOf" + id;
      var transformedRow = transformString(tableNumber, tableMultiplier, tableRow);
      transformedRow = insertPossibilities(transformedRow, tableNumber, tableMultiplier);
      $("#"+ident+" tbody").append(transformedRow);
    }
  }
}

function transformString(tableNumber, tableMultiplier, tableRow){
  var splitString = tableRow.concat().split('?');
  var newString = "";
  newString = splitString[0] + tableNumber + splitString[1] + tableNumber + splitString[2] + tableMultiplier + splitString[3] + (tableNumber*tableMultiplier) + splitString[4];
  return newString;
}

function insertPossibilities(row, tableNumber, tableMultiplier){
  if(/\sclass='toetsVraag\b/i.test(row) === true){
    var newRow = "";
    var splitRow = row.concat().split('/>');

    var possibilities = generatePossibilities(tableNumber, tableMultiplier);

    newRow = splitRow[0] + "<div class='antwoorden'><div class='antwoord'><input type='radio' name='vraag"+tableNumber+tableMultiplier+"' id='antwoord1'/><label for='antwoord1'>"+possibilities[0]+"</label></div><div class='antwoord'><input type='radio' name='vraag"+tableNumber+tableMultiplier+"' id='antwoord2'/><label for='antwoord2'>"+possibilities[1]+"</label></div><div class='antwoord'><input type='radio' name='vraag"+tableNumber+tableMultiplier+"' id='antwoord3'/><label for='antwoord3'>"+possibilities[2]+"</label></div></div>" + splitRow[1];

    return newRow;
  } else {
    return row;
  }
}

function generatePossibilities(number, multiplier){
  var possibilities = new Array();

  var answer = number * multiplier;

  for (var i = 0; i < 2; i++) {
    var acceptable = true;
    if(number == 1 || multiplier == 1){
      var possibilitiesNow = [ answer, parseInt(number.toString()+multiplier.toString()), number+multiplier];

      var randomNumber = Math.floor(Math.random() * 2); //generates number between 0 and 2
      possibilities.push(possibilitiesNow[randomNumber]);
      possibilitiesNow.splice(possibilitiesNow.indexOf(possibilitiesNow[randomNumber]), 1);

      randomNumber = Math.floor(Math.random() * 1);//number between 0 and 1
      possibilities.push(possibilitiesNow[randomNumber]);
      possibilitiesNow.splice(possibilitiesNow.indexOf(possibilitiesNow[randomNumber]), 1);

      possibilities.push( possibilitiesNow.pop() );
      return possibilities;
    } else {
      var possibility = Math.floor(Math.random()*answer+10) + number;//random number that is higher then that number but never higher then the answer+10

//Checks if possibility is acceptable
    //possibility needs to be a multiple of or needs to be the number
    if( (possibility % number) === 1){
      acceptable = false;
    } else if (possibility == answer){
      acceptable = false;
    }
    //possibility cant be a number that is already in the list
      for (var j = 0; j < possibilities.length; j++) {
        var possibilityInArray = possibilities[j];
        if( parseInt(possibility) == parseInt(possibilityInArray) ){
          acceptable = false;
        }
      }

      if(acceptable === true){ //acceptable is true push possibility in array else make a new possibility
        possibilities.push(possibility);
      }

      i--;
      if(i < 0){
        i = 0;
      }

      if(possibilities.length === 2){
        var randomNumber = Math.floor(Math.random() * 3);
        var old = possibilities[randomNumber];
        possibilities[randomNumber] = answer;
        possibilities.push(old);
        i=3;
      }
    }
  }
  return possibilities;
}

function preventEmptyInput(){
	$("input[type=number]").on("keyup", function(){
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
