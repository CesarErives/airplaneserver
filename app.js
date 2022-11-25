let app = require('express')();
let server = require('http').createServer(app);

let io = require('socket.io')(server,{
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      transports: ['websocket', 'polling']
    }
  });

let position = {
    servoLeft: 0,
    servoRight: 0,
    motor:0
}

io.on('connection', (socket) => {
 
  socket.on('disconnect', function(){
    io.emit('users-changed', {user: socket.username, event: 'left'});  
  });
  
  socket.on('set-name', (name) => {
    socket.username = name;
    io.emit('users-changed', {user: name, event: 'joined'});    
  });
  
  socket.on('send-message', (message) => {
    io.emit('message', {msg: message.text, user: socket.username, createdAt: new Date()});    
  });

  socket.on('speed', data => {
    position.motor = data.number;
    io.emit("position",position);
    console.log(position);
  });

  
  socket.on('flaps', data => {
    switch(data) {
        case "left":
            position.servoLeft = 0;
            position.servoRight = 180;
            console.log(position);
            break;
        case "right":
            position.servoLeft = 180;
            position.servoRight = 0;
            console.log(position);
            break;
        case "up":
            position.servoLeft = 0;
            position.servoRight = 180;
            console.log(position);
            break;
        case "down":
            position.servoLeft = 180;
            position.servoRight = 0;
            console.log(position);
            break;
        case "center":
          position.servoLeft =110;
          position.servoRight =70;
          console.log(position);
          break;
    }
socket.emit("position", position);
});

});
var port = process.env.PORT || 3001
server.listen(port, function(){
   console.log('listening in http://localhost:' + port);
});



/*
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
*/