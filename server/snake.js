class Snake {

  constructor(boardSize) {
    this.boardSize = boardSize;
    this.board = this.createBoard();
    this.startTimer();

    this.playerList = [];
    this.snakeList = [];
    this.playerID = 2;

    const settings = require('./settings.js');
    this.playerColours = settings.playerColours;
    this.spawnFood();
  }

  addPlayer(playerName, socket) {
    // increments the total id count for this session

    // assigns an available colour
    var playerColour;
    if (this.playerList.length == 0) {
      playerColour = this.playerColours[0].hex;
      this.playerColours[0].val = true;
    }
    else {
      for (var i = 0; i < this.playerColours.length; i++) {
        if (this.playerColours[i].val == false) {
          playerColour = this.playerColours[i].hex;
          this.playerColours[i].val = true;
          break;
        }
      }
    }

    var spawnX = 30;
    var spawnY = 30;

    var direction = 'RIGHT';

    // assigns location

    var playerData = {
      id: this.playerID,
      name: playerName,
      colour: playerColour,
      size: 2,
      direction,
      head: {
        x: spawnX,
        y: spawnY
      },
      tail: {
        x: spawnX - 1,
        y: spawnY
      },
      socket
    }

    playerData.head.next = playerData.tail;
    playerData.tail.prev = playerData.head;

    var snakeList = [];

    var playerSnake = {
      id: this.playerID,
      colour: playerColour
    }

    this.playerID++;

    this.board[playerData.head.x][playerData.head.y] = playerData.id;
    this.board[playerData.tail.x][playerData.tail.y] = playerData.id;

    this.playerList.push(playerData);
    this.snakeList.push(playerSnake);

    console.log("ID: " + playerData.id + " Name: " + playerData.name + " Colour: "+ playerData.colour);
  }

  removePlayer(socket) {
    for (var i = 0; i < this.playerList.length; i++) {
      if (this.playerList[i].socket == socket) {
        // makes colour available
        var colour = this.playerList[i].playerColour;
        for (var i = 0; i < this.playerColours.length; i++) {
          if (this.playerColours[i].hex == colour) {
            this.playerColours[i].val = false;
            break;
          }
        }
        // removes player data
        this.playerList.splice(i, 1);
        console.log('player removedddddd');
        break;
      }
    }
  }

  createBoard() {
    console.log('Board created');
    var board = new Array(this.boardSize);
    for (var i = 0; i < this.boardSize; i++) {
      board[i] = new Array(this.boardSize);
      for (var j = 0; j < this.boardSize; j++) {
        board[i][j] = 0;
      }
    }
    return board;
  }

  setListener(eventListener) {
    this.listener = eventListener;
  }

  movePlayers() {
    for (var i = 0; i < this.playerList.length; i++) {

      var nextX;
      var nextY;

      if (this.playerList[i].direction == "RIGHT" || this.playerList[i].direction == "LEFT") {
        nextX = this.nextStepHorizontal(i, this.playerList[i].head.x, this.playerList[i].direction)
        nextY = this.playerList[i].head.y;
      }
      if (this.playerList[i].direction == "UP" || this.playerList[i].direction == "DOWN") {
        nextY = this.nextStepVertical(i, this.playerList[i].head.y, this.playerList[i].direction)
        nextX = this.playerList[i].head.x;
      }

      if (this.board[nextX][nextY] == 1) {
        this.playerPush(i, nextX, nextY);
        this.spawnFood();
      } else if (this.board[nextX][nextY] > 2) {

      } else {
        this.playerPush(i, nextX, nextY);
        this.playerPop(i);
      }

      //console.log(this.playerList[i].tail.x + " " + this.playerList[i].tail.prev.x)

    }
  }

  nextStepHorizontal(i, x, dir) {
    if (dir == "RIGHT") {
      if (this.playerList[i].head.x + 1 >= 60) return 0;
      else return this.playerList[i].head.x + 1;
    }
    else if (dir == "LEFT") {
      if (this.playerList[i].head.x - 1 < 0) return 59;
      else return this.playerList[i].head.x - 1;
    }
  }

  nextStepVertical(i, y, dir) {
    if (dir == "UP") {
      if (this.playerList[i].head.y - 1 < 0) return 59;
      else return this.playerList[i].head.y - 1;
    }
    else if (dir == "DOWN") {
      if (this.playerList[i].head.y + 1 >= 60) return 0;
      else return this.playerList[i].head.y + 1;
    }
  }

  playerPush(i, x, y) {
    var newHead = {x, y};
    var next = this.playerList[i].head;
    this.playerList[i].head = newHead;
    this.playerList[i].head.next = next;
    this.playerList[i].head.next.prev = this.playerList[i].head;
    this.board[x][y] = this.playerList[i].id;

  }

  playerPop(i) {
    this.board[this.playerList[i].tail.x][this.playerList[i].tail.y] = 0;
    this.playerList[i].tail = this.playerList[i].tail.prev;
  }

  spawnFood() {
    var x = Math.floor((Math.random() * this.boardSize));
    var y = Math.floor((Math.random() * this.boardSize));

    this.board[x][y] = 1;
  }


  keyStroke(keyCode, socket) {
    for (var i = 0; i < this.playerList.length; i++) {
      if (this.playerList[i].socket == socket) {
        if (keyCode == 37 && this.playerList[i].direction != "RIGHT") this.playerList[i].direction = "LEFT";
        if (keyCode == 38 && this.playerList[i].direction != "DOWN") this.playerList[i].direction = "UP";
        if (keyCode == 39 && this.playerList[i].direction != "LEFT") this.playerList[i].direction = "RIGHT";
        if (keyCode == 40 && this.playerList[i].direction != "UP") this.playerList[i].direction = "DOWN";
      }
    }
  }


  gameUpdate() {
    this.movePlayers();

    if (typeof this.listener !== 'undefined') {
      var data = {
        board: this.board,
        snakeList: this.snakeList
      };
      this.listener('update', data);
    }
    //console.log("listener not working");
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.gameUpdate();
    }, 100);
  }


}

module.exports = Snake;
