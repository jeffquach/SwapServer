module.exports = function(io){
  io.on('connection', function (socket) {

    // when the client emits 'add user', this listens and executes
    socket.on('add user', function (username, nameOfRoom, previousChatRoomName) {
      // console.log("$$$ In event 'add user', username is, nameOfRoom, previousChatRoomName is $$$");
      // console.log(username);
      // console.log(nameOfRoom);
      var uniqueRoomName = "room:"+nameOfRoom;
      // console.log("$$$ ADD USER uniqueRoomName $$$:");
      // console.log(uniqueRoomName);
      socket.join(uniqueRoomName);
      // console.log("$$$ socket id after joining room $$$:");
      // console.log(socket.id);
      socket.username = username;
    });

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', function (message, nameOfRoom, currentlyChattingWith, senderOfMessage) {
      // console.log("$$$ message in 'typing' action of callback is $$$:");
      // console.log(message);
      // console.log("$$$ 'typing' --> username: socket.username $$$:");
      // console.log(socket.username);
      // console.log("$$$ 'typing' --> nameOfRoom $$$:");
      // console.log(nameOfRoom);
      // console.log("$$$ 'typing' --> currentlyChattingWith $$$:");
      // console.log(currentlyChattingWith);
      // console.log("#######################");
      // console.log("$$$ io.sockets.connected $$$:");
      // console.log(io.sockets.connected);
      // console.log("#######################");
      // console.log("$$$ socket.id $$$");
      // console.log(socket.id);
      // console.log("$$$ socket.rooms BEFORE $$$");
      // console.log(socket.rooms);
      // console.log("$$$ socket.rooms AFTER $$$");
      // console.log(socket.rooms);
      var uniqueRoomName = "room:"+nameOfRoom;
      // console.log("$$$ TYPING uniqueRoomName $$$:");
      // console.log(uniqueRoomName);
      socket.join(uniqueRoomName);
      socket.broadcast.to(uniqueRoomName).emit('typing', {
        message: message,
        currentlyChattingWith: currentlyChattingWith,
        senderOfMessage: senderOfMessage
      });
    });
  });
};