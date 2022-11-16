const Express = require('express')
const Http = require('http').Server(Express);
let Socketio = require('socket.io')(Http ,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        transports:['websocket', 'polling']
      }});

Http.listen(3000, () => {
    console.log("Listening at :3000...");
});

var position = {
    x: 200,
    y: 200
};

Socketio.on("connection", socket => {
    socket.emit("position", position);
    socket.on("move", data => {
        switch(data) {
            case "left":
                position.x -= 5;
                Socketio.emit("position", position);
                break;
            case "right":
                position.x += 5;
                Socketio.emit("position", position);
                break;
            case "up":
                position.y -= 5;
                Socketio.emit("position", position);
                break;
            case "down":
                position.y += 5;
                Socketio.emit("position", position);
                break;
        }
    });
});

