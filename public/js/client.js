var canvas;
var ctx;

var socket;
var playerName;
var playerColour;


function initGame() {
  canvas = document.getElementById('c');
  ctx = canvas.getContext('2d');

  window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }
  }, false);


  console.log('init');
  socket = io();
  playerName = 'Test';

  //getPlayerName();
  // temp

  socket.on('update', function(data) {
    if (typeof data.board !== 'undefined' && typeof data.snakeList !== 'undefined') {
      if (data.snakeList.length > 0) updateScoreboard(data);
      renderBoard(data);
    }
    else console.log("Issue with board or player");
  });

}

function buttonInput() {
  var input = document.getElementById('name-input');
  var button = document.getElementById('enter');
  var m = document.getElementById('input-m');

  var name = input.value;

  console.log(name);
  if (typeof name !== 'undefined' && name != "") {
    playerName = name;
    getPlayerName();
    input.remove();
    button.remove();
    m.remove();
  }
}

function addPlayerScore(name, colour, score) {
  var text = name + " - " + (score - 2);
  var scoreboard = document.getElementById("player-list");
  var newPlayer = document.createElement("li");
  var textnode=document.createTextNode(text);
  newPlayer.appendChild(textnode);
  newPlayer.className += " player";
  newPlayer.style.color = colour;
  scoreboard.appendChild(newPlayer);
}

function getPlayerName() {
  socket.emit('start', playerName);
}

document.onkeydown = function(e) {
  e = e || window.event;

  if (e.keyCode !== 37 && e.keyCode !== 38 && e.keyCode !== 39 && e.keyCode !== 40) return;
  socket.emit('keystroke', e.keyCode);
}

function updateScoreboard(data) {
  var scoreboard = document.getElementById("player-list");
  scoreboard.innerHTML="";

  for (var i=0; i<data.snakeList.length; i++) {
    addPlayerScore(data.snakeList[i].name, data.snakeList[i].colour, data.snakeList[i].score);
  }
}


function renderBoard(data) {
  var board = data.board;
  var snakeList = data.snakeList;
  // draw to canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < 60; i++) {
    for (var j = 0; j < 60; j++) {
      if (board[i][j] == 0) {
        ctx.fillStyle = "black";
        ctx.fillRect(i * 11, j * 11, 10, 10);
      }

      if (board[i][j] >= 2) {
        for (var k = 0; k < snakeList.length; k++) {
          if (snakeList[k].id == board[i][j]) {
            ctx.fillStyle = snakeList[k].colour;
            ctx.fillRect(i * 11, j * 11, 10, 10);
            break;
          }
        }
      }

      if (board[i][j] == 1) {
        ctx.fillStyle = "#6AD32A";
        ctx.fillRect(i * 11, j * 11, 10, 10);
      }
    }
  }
}
