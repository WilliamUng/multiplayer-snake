const Snake = require('./snake.js');
const settings = require('./settings.js');


var socketList = [];
var snake;

var initServer = function(io) {


  io.on('connection', this.connection);
  snake = new Snake(settings.boardSize);
  snake.setListener(this.gameEvent);


}

var connection = function(socket) {
  socketList.push(socket);

  socket.on('start', function(playerName) {
    console.log(playerName + ' has entered the game.');
    snake.addPlayer(playerName, socket);
  });
  socket.on('disconnect', function() {
    console.log('A player has disconnected');
    snake.removePlayer(socket);
  });
  socket.on('keystroke', function(keyCode) {
    snake.keyStroke(keyCode, socket);
  });
}

var initPlayer = function(socket) {

}




var gameEvent = function(event, data) {
  if (event == 'update' && typeof socketList !== 'undefined') {
    for (var i = 0; i < socketList.length; i++) {
      socketList[i].emit('update', data);
    }
  }
}



module.exports = {initServer, gameEvent, connection, initPlayer, socketList, snake};
