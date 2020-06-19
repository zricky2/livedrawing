var express = require('express');
// Create the app
var app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 8080, listen);

// This call back just tells us that the server has started
function listen() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://' + host + ':' + port);
}

app.use(express.static('public'));

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
    // We are given a websocket object in our function
    (socket) => {

        console.log("We have a new client: " + socket.id);

        // When this user emits, client side: socket.emit('otherevent',some data);
        socket.on('mouse',(data) => {
                 // sending to all clients except sender
                socket.broadcast.emit('mouse', data);
                // This is a way to send to everyone including sender
                // io.sockets.emit('message', "this goes to everyone");
            }
        );

        socket.on('click', () => {
            socket.broadcast.emit('click');
        })

        socket.on('disconnect', function () {
            console.log("Client has disconnected");
        });
    }
);