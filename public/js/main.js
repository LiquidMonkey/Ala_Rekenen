$(document).ready(function(){
  initButtons();
  $(".test").fadeOut(0);
  $(".toggleDiv").click().click();//makes sure the divs are closed
  $(".toggleDiv").eq(0).click();
  $("#checkToets").fadeOut(0).next().fadeOut(0);//hides the two button that are at the end of the toets section so they dont show up untill the user choses to make the test

  //initializing global variables high and low
  low = parseInt( $("#lowestTable").val() );
  high = parseInt( $("#highestTable").val() );
  $("#lowestTable, #highestTable").on("change", function(){
    var lowTable = $("#lowestTable");
    var highTable = $("#highestTable");
    if( parseInt( lowTable.val() ) > parseInt( highTable.val() ) && parseInt( lowTable.val() ) != "" && parseInt( highTable.val() ) != ""){
      high = parseInt( lowTable.val() );
      highTable.val(parseInt( lowTable.val() ));

      low = parseInt( highTable.val() );
      lowTable.val(parseInt( highTable.val() ));
    } else if( parseInt( lowTable.val() ) != "" && parseInt( highTable.val() ) != "" ){
      low = parseInt( $("#lowestTable").val() );
      high = parseInt( $("#highestTable").val() );
    } else{
      //does nothing because they are invalid inputs therefore nothing has changed
    }
  });

  var tableRow ="<tr class='?'> <td class='number'>?</td> <td>x</td> <td class='multiplier'>?</td> <td>=</td> <td>?</td> </tr>";

  var target = $("#tableContainer");
  openTables(tableRow, target);

  initQuestions();
  questionairBehaviour();

  preventEmptyInput();//this function prevents inputfields of the number type to be empty
});

/*global variables*/
var low;
var high;

//below are mainy used for openTables(row, target)
var highestTable = 10;
var highestMultiplier = 10;
var id = 0;

//below are for questionairBehaviour and for finishTest
var oefenenProgress = 0;
var fouten = 0;
/*end global variables*/

function initButtons(){
  //following button opens the tables if the standard values of the spinners has been changed
  $("#openTables").click(function(){
    var tableRow = "<tr class='?'> <td>?</td> <td>x</td> <td>?</td> <td>=</td> <td>?</td> </tr>";
    var target = $("#tableContainer");

    openTables(tableRow, target);//opens the tables x till and including y
  });

  $("#toetsen").click(function(){
    var tableRow ="<tr class='toetsVraag ?'> <td>?</td> <td>x</td> <td>?</td> <td>=</td> <td data-answer='?'><input class='answer' type='number' value='0' min='0'/></td> </tr>";
    var target = $("#practiceTables");
    openTables(tableRow, target);

    $(this).parent().fadeOut(100).next().fadeIn(300);
    $("#checkToets").fadeIn(0);
    $(this).closest("article").children("h1").text("Toets").append(" <span class=\"arrow\"></span>");
  });
  $("#oefenen").click(function(){
    $(this).parent().fadeOut(100).next().next().fadeIn(300);
    $(this).closest("article").children("h1").text("Oefentoets").append(" <span class=\"arrow\"></span>");
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

  $("#checkToets").click(function(){
    var inputs = $("input[class~=answer]");
    fouten = 0;//making sure that fouten = 0 before adding anything
    jQuery.makeArray(inputs).forEach(function(entry){//makes jquery object into an array so i can loop through it with a forEach loop
      if( $(entry).val() == $(entry.parentElement).data("answer") ){
        $(entry).removeClass("wrong");
        $(entry).addClass("correct");
      } else {
        $(entry).removeClass("correct");
        $(entry).addClass("wrong");
        fouten++;
      }
    });
    $(this).hide().next().show();
  });
  $("#closeToets").click(function(){
    $("#resultTrigger").click();
    $('#result').focus();
    var totalQuestions = $(".toetsVraag").length;
    var cijfer = (totalQuestions - fouten) / totalQuestions * 100; //elke fout cost dus een half punt
    $(".modal-body").text("").append("U had " + fouten + " vragen van de " + totalQuestions + " fout. Uw score is dus " + cijfer + "%");
    if(cijfer < 50){
      $(".modal-body").append("<a id='download' href='./oefenblad.pdf' class='btn btn-primary btn-lg' target='_blank'>Download oefenblad</a>");
    }
    $(this).hide().prev().prev().prev().fadeOut(100).prev().fadeIn(300);
  });

}

function openTables(tableRow, target){
  var ident;
  var startingTable = low;
  highestTable = high;//this variable has been initialized above the initTables function

  target.contents().remove();//empty the container

  for(var tableNumber = startingTable; tableNumber < highestTable+1; tableNumber++){
	  id++;
    target.append("<table id='tableOf" + id + "'> <tbody></tbody></table>");
    for(var tableMultiplier = 1; tableMultiplier < highestMultiplier+1; tableMultiplier++){
	    ident = "tableOf" + id;
      var transformedRow = transformString(tableNumber, tableMultiplier, tableRow);
      //transformedRow = insertPossibilities(transformedRow, tableNumber, tableMultiplier);
      $("#"+ident+" tbody").append(transformedRow);
    }
  }
}

function transformString(tableNumber, tableMultiplier, tableRow){
  var splitString = tableRow.concat().split('?');
  var newString = "";
  newString = splitString[0] + tableNumber + splitString[1] + tableMultiplier + splitString[2] + tableNumber + splitString[3] + (tableNumber*tableMultiplier) + splitString[4];
  return newString;
}

/*InsertPossibilities and generatePossibilities are removed and are not used in final product*/
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
	$("input[type=number]").on("blur", function(){
		var check;
		if( $(this).val() != "" ){
			check = $(this).val();
		} else {
			check = false;
		}

		if( check === false ){
			$(this).val(1);
		}
	});
}

function initQuestions() {
  //var randomQuestion = Math.round( Math.random() * ((high - low) * 10) );
  var num = Math.floor(Math.random() * 10) + 1;
  var multiplier = Math.floor(Math.random() * high) + low;

  $(".vraag").val(num + " x " + multiplier);
}

function questionairBehaviour(){
  var triesLeft = 2;
  $('.antwoord').on("keyup", function(){
    if(event.keyCode == 13){
      if( checkAnswer($(this)) ){
        $(this).val("");
        oefenenProgress += 10;
        $('.progress-bar').css('width', oefenenProgress+'%').attr('aria-valuenow', oefenenProgress);
        $(".fuelProgress").text(oefenenProgress);
        if(oefenenProgress != 100){
          initQuestions();
        } else {
          initQuestions();
          finishTest(fouten);
          oefenenProgress = 0;
          $(".progress-bar").css('width', oefenenProgress+'%').attr('aria-valuenow', oefenenProgress);
          $(".fuelProgress").text(oefenenProgress);
          $(".antwoord").removeClass("correct");
        }
      } else {
        if(fouten > 20){
          finishTest(fouten);
        } else {
          triesLeft--;
          $("#userInformation").text("U krijgt nog één kans om deze vraag goed te beantwoorden");
          fouten += 1;
          if(triesLeft == 0){
            initQuestions();
            triesLeft = 2;
            $("#userInformation").text("Vul de tank!");
          }
        }
      }
    }
  }).on("keydown", function(){
    var currentClass;
    if($(this).hasClass("correct")){
      currentClass = "correct";
    } else if($(this).hasClass("wrong")) {
      currentClass = "wrong";
    } else {
      //function shouldnt do anything because it has no classes to remove
    }
    if(currentClass != ""){
      $(this).toggleClass(currentClass);
    }
  });
}

function checkAnswer(obj){
  var userAnswer = obj.val();
  var answer = obj.prev().prev().val();
  answer = answer.split(' ');
  answer = answer[0] * answer[2];
  if(userAnswer == answer){
    judge(obj, true);
    return true;
  } else {
    judge(obj, false);
    return false;
  }
}

function judge(target, mission){
  if(mission == true && target.hasClass('correct') || mission == false && target.hasClass('wrong')){
    //do nothing because the class is already what it should be changed to
  } else if( target.hasClass('wrong') ){
    target.toggleClass('wrong');
    target.toggleClass('correct');
  } else if (target.hasClass('correct')){
    target.toggleClass('correct');
    target.toggleClass('wrong');
  } else{
    if(mission == true){
      target.addClass("correct");
    } else if (mission == false){
      target.addClass("wrong");
    } else {
      throw new console.error("SOMETHING WENT HORRIBLY WRONG! please help me i dont know what to do tell them i dont know how to judge!");
    }
  }
}

function finishTest(aantalFout){
  var cijfer = 10 - aantalFout * 0.5; //elke fout cost dus een half punt
  $(".modal-body").text("").append("U had " + aantalFout + " vragen fout. Uw cijfer is dus: " + cijfer);
  if(cijfer < 5.5){
    $(".modal-body").append("<a id=\"download\" href=\"./oefenblad.pdf\" class=\"btn btn-primary btn-lg\" target=\"_blank\">Download oefenblad</a>");
  }

  $("#resultTrigger").click();
  $('#result').focus();

  resetTests();
}

function resetTests(){
  $(".test").fadeOut(100);
  $(".antwoord").removeClass("correct");
  $(".choiceContainer").fadeIn(300);
}
