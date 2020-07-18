var express = require('express');
var app = express();
var socket = require('socket.io');
const port = 4000;
var server = app.listen(port,() => {
    console.log("Listening to reqeusts on port 4000")
});
app.use(express.static('public'))

var io = socket(server)
io.on('connection', (client) => {
    console.log(client.id);
    client.on('message', (message) => {
        io.sockets.emit('message',message)
    });
    client.on('disconnect',() => {
        io.sockets.emit('message',{name:'server',message:`client ${client.id} has disconnected`})
    })
});
