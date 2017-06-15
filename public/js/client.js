var canvas;
var ctx;

var socket;

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
  getPlayerName();

  socket.on('update', function(data) {
    if (typeof data.board !== 'undefined' && typeof data.snakeList !== 'undefined') renderBoard(data);
    else console.log("Issue with board or player")
  });

}

function getPlayerName() {
  socket.emit('start', 'Test');
}

document.onkeydown = function(e) {
  e = e || window.event;

  if (e.keyCode !== 37 && e.keyCode !== 38 && e.keyCode !== 39 && e.keyCode !== 40) return;
  console.log('keystroke detected');
  socket.emit('keystroke', e.keyCode);
}




function renderBoard(data) {
  var board = data.board;
  var snakeList = data.snakeList;
  console.log(board[30][30]);
  // draw to canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < 60; i++) {
    for (var j = 0; j < 60; j++) {
      if (board[i][j] == 0) {
        ctx.fillStyle = "#00283B";
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
