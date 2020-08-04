var express = require('express');
var request = require('request');
var app = express();
var socket = require('socket.io');
const port = 4000;
var server = app.listen(port,() => {
    console.log("Listening to reqeusts on port 4000")
});
app.use(express.static('public'))
var io = socket(server)
var users = [];
io.on('connection', (client) => {
    handleNewUser(client)
    client.on('message', (message,token) => {
        request.post(
            'https://api.allshack.lukaku.tech/message',
            {headers: {Accept: 'application/json', Authorization: `Bearer ${token.token}`},body: JSON.stringify(message)},
            function (error, response, body) {
                if (!error && response.statusCode == 201) {
                    var message = JSON.parse(body);
                    users.filter(user => {
                        if(user.id == message.toUser) {
                            message.isMe = false;
                            io.to(user.socketId).emit('message',message);
                        } else if (user.id == message.fromUser) {
                            message.isMe = true;
                            io.to(user.socketId).emit('message',message);
                        }
                    })
                }
            }
        );
    });
    client.on('disconnect',() => {
        io.sockets.emit('disconnected',{name:'server',message:`client ${client.id} has disconnected`})
    })
});

function handleNewUser(socket) {
    const id = socket.handshake.query.id
    const socketId = socket.id
    var newUsers = users.filter(user => user.id != id);
    users = [...newUsers]
    users.push({id: id,socketId: socketId})
}
