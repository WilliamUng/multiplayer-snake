
var canvas;
var ctx;

var socket;
var playerName;
var playerColour;
var playerCount;



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

  //getPlayerName();
  // temp

  socket.on('update', function(data) {
    if (typeof data.board !== 'undefined' && typeof data.snakeList !== 'undefined') {
      playerCount = data.snakeList.length;
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
  if (typeof name !== 'undefined' && name.trim().length !== 0 && playerCount < 8 && name.length <=15) {
    playerName = name;
    getPlayerName();
    input.remove();
    button.remove();
    m.remove();
  }
}

function addPlayerScore(name, colour, score, rank) {
  var ranklist = document.getElementById("rank-list");
  var playerlist = document.getElementById("player-list");
  var scorelist = document.getElementById("score-list");

  var playerRank = document.createElement("li");
  var rankNode=document.createTextNode(rank);
  playerRank.appendChild(rankNode);
  playerRank.style.color = "white";
  playerRank.style['background-color'] = colour;
  playerRank.className += " rank";
  //playerRank.style.color = colour;
  ranklist.appendChild(playerRank);

  var player = document.createElement("li");
  var nameNode=document.createTextNode(name);
  player.appendChild(nameNode);
  player.className += " player";
  player.style.color = "white";
  player.style['background-color'] = colour;
  playerlist.appendChild(player);

  var playerScore = document.createElement("li");
  var scoreNode=document.createTextNode(score);
  playerScore.appendChild(scoreNode);
  playerScore.className += " score";
  playerScore.style.color = "white";
  playerScore.style['background-color'] = colour;
  //playerScore.style.color = colour;
  scorelist.appendChild(playerScore);
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
  var ranklist = document.getElementById("rank-list");
  ranklist.innerHTML="";
  var playerlist = document.getElementById("player-list");
  playerlist.innerHTML="";
  var scorelist = document.getElementById("score-list");
  scorelist.innerHTML="";

  var sortedList = [];

  sortedList = _.sortBy(data.snakeList, "score").reverse();
  console.log(sortedList);

  for (var i=0; i<data.snakeList.length; i++) {
    addPlayerScore(sortedList[i].name, sortedList[i].colour, sortedList[i].score-2, i+1);
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
