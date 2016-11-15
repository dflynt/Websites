var CLIPlayer = function(game, cli_input, cli_output, map, is_player_one) {

    if (is_player_one) {
	var key = game.registerPlayerOne();
    } else {
	key = game.registerPlayerTwo();
    }


    gameOutput = $(".gameOutput");
    cli_input = $(cli_input);
    map = $(map);
    alert("---Color Code---\nInvisible: Dark blue\nEmpty: Light Blue\nMiss: Yellow\n" +
    "Hit: Red\nPlayer One: Grey\nPlayer One Hit: Blue\nPlayer Two: Orange\nPlayer Two Hit: Red");
  var eventLogHandler = function(e) {
	var cli_msg = $('<div class="cli_msg"></div>');
  var playerOneTurnCounter = $(".playerOneTurnCounter");
  var aiTurnCounter = $(".aiTurnCounter");
	switch (e.event_type) {
	case SBConstants.TURN_CHANGE_EVENT:
	    if (e.who == SBConstants.PLAYER_ONE) {
	      playerOneTurnCounter.text("Player Turn Number: " + game.getTurnCount());
	    } else {
        aiTurnCounter.text("AI Turn Number: " + game.getTurnCount());
       }
	    break;
	case SBConstants.MISS_EVENT:
	    cli_msg.text("Miss event at (" + e.x + ", " + e.y + ")");
	    break;
	case SBConstants.HIT_EVENT:
	    cli_msg.text("Hit event at (" + e.x + ", " + e.y + ")");
	    break;
	case SBConstants.SHIP_SUNK_EVENT:
	    var ship = e.ship;
	    if (ship.isMine(key)) {
		var pos = ship.getPosition(key);
		cli_msg.text("Foe sunk your " + ship.getName() + " at (" + pos.x + ", " + pos.y + ")");
	    } else {
		var pos = ship.getPosition(null); // This works because ship is dead.
    cli_msg.text("You sunk their " + ship.getName() + " at (" + pos.x + ", " + pos.y + ")");
	    }
	    break;
	case SBConstants.GAME_OVER_EVENT:
	    if (is_player_one && e.winner == SBConstants.PLAYER_ONE) {
        } else {
		    cli_msg.text("Game over. You lose!");
	    }
	    break;
	}
	gameOutput.prepend(cli_msg);
    };

    game.registerEventHandler(SBConstants.TURN_CHANGE_EVENT,
			      eventLogHandler);
    game.registerEventHandler(SBConstants.MISS_EVENT,
			      eventLogHandler);
    game.registerEventHandler(SBConstants.HIT_EVENT,
			      eventLogHandler);
    game.registerEventHandler(SBConstants.SHIP_SUNK_EVENT,
			      eventLogHandler);

  var mapDrawHandler = function(e) {
	map.empty();

	var map_str = "";
	for (var y=0; y<game.getBoardSize(); y++) {
    map_str += "<tr id = \"row\">";
	    for (var x=0; x<game.getBoardSize(); x++) {
		var sqr = game.queryLocation(key, x, y);
		switch (sqr.type) {
		case "miss":
		    map_str += "<td id = \"miss\"></td>";
		    break;
		case "p1":
		    if (sqr.state == SBConstants.OK) {
			map_str += "<td id = \"playerOne\"></td>";
		    } else {
			map_str += "<td id = \"playerOneX\"></td>";
		    }
		    break;
		case "p2":
		    if (sqr.state == SBConstants.OK) {
			map_str += "<td id = \"playerTwo\"></td>";
		    } else {
			map_str += "<td id = \"playerTwoX\"></td>";
		    }
		    break;
		case "empty":
		    map_str += "<td id = \"empty\"></td>";
		    break;
		case "invisible":
		    map_str += "<td id = \"invisible\"></td>";
		    break;
		}
	    }
	    map_str += "</tr>";
	}

	map.append($('<table id = "gameTable"></table>').html(map_str));
    };

    game.registerEventHandler(SBConstants.TURN_CHANGE_EVENT,
			      mapDrawHandler);
$(document).ready(function()
{
  fleetInfo();
var ship_name;
$("input.choice").on('change', function()
{
  ship_name = this.value;
  $("input.choice").not(this).prop('checked', false);
});

function fleetInfo(){
  var table = $(".fleetInfo");
  table.empty();
  table.append('<th>Ship</th>');
  table.append('<th>Position</th>');
  table.append('<th>Direction</th>');
  table.append('<th>Size</th>');
  table.append('<th>Status</th>');
  var fleet = game.getFleetByKey(key);
  fleet.forEach(function (s) {
  var tr = $('<tr class = "info"></tr>');
  var htmlTR = tr;
  htmlTR.append(('<td class = "name">' + s.getName() + '</td>'));
  var ship_pos = s.getPosition(key);
  var data = "(" + ship_pos.x + ", " + ship_pos.y + ")";
  htmlTR.append(('<td class = "position">' + data +'</td>'));
  htmlTR.append(('<td class = "direction">' + ship_pos.direction + '</td>'));
  htmlTR.append(('<td class = "size">' + s.getSize() + '</td>'));
  if (s.getStatus() == SBConstants.ALIVE) {
    htmlTR.append(('<td class = "status">' + "ALIVE" + '</td>'));
  } else {
    htmlTR.append(('<td class = "status">' + "DEAD" + '</td>'));
  }
  table.append(htmlTR);
});
}
$("#shootAt").click(function()
{
  $("#gameTable td").on('click', function()
  {
      var x = this.cellIndex;
      var y = this.parentNode.rowIndex;
      game.shootAt(key, x, y);
  });
});

$("#buttonList > #moveForward").click(function(){
    var ship = game.getShipByName(key, ship_name);
    if (ship !== null) {
      game.moveShipForward(key, ship);
      fleetInfo();
    }
});

$("#buttonList > #moveBackward").click(function(){
  var ship = game.getShipByName(key, ship_name);
  if (ship !== null) {
    game.moveShipBackward(key, ship);
    fleetInfo();
  }
});
$("#buttonList > #rotateCW").click(function(){
  var ship = game.getShipByName(key, ship_name);
  if (ship !== null) {
    game.rotateShipCW(key, ship);
    fleetInfo();
  }
});
$("#buttonList > #rotateCCW").click(function(){
  var ship = game.getShipByName(key, ship_name);
  if (ship !== null) {
    game.rotateShipCCW(key, ship);
    fleetInfo();
  }
});
});
};
