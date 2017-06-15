const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, 'public')));


var socket_server = require('./server/server.js');



socket_server.initServer(io);

server.listen(3000, function() {
  console.log('Server running on 3000');
});
/*
app.get('/', function(req, res) {
  res.sendFile('index.html', path.join(__dirname, 'public');
}
*/
