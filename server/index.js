const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const PORT = process.env.PORT || 3000;
const http = require('http').Server(app);
const io = require('socket.io').listen(http);

let currentColor;
let users = {}; // to store users
let currentlyTyping = {}; // to store who's typing

app.use(express.static(`${__dirname}/../`));

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../index.html`));
});

io.on('connection', (socket) =>{
  let nickname;
  console.log('a user is connected');
  //io.emit('joinedRoom', `${socketId} has joined the chat.`)

  if (currentColor) {
    socket.emit('color', currentColor);
  }

  socket.on('nickname', (name) => {
    if(!users[name]) { // if not in the users obj
      users[name] = socket; // add
      nickname = name;
      socket.emit('nickname', {name, code: 'OK'}); // emit OK for hide/show on clientdie
      socket.emit('isTyping', Object.keys(currentlyTyping));
      socket.broadcast.emit('joinedRoom', `${nickname} has joined the chat.`); // emit to al except sender that you join
      io.emit('users', Object.keys(users));
    } else {
      socket.emit('nickname', {code: 'NO', msg: `Username '${name}' , has already been taken`}); // emit NO for error
    }
  });

  socket.on('color', (color) => {
    console.log(color);
    currentColor = color;
    io.emit('color', color);
  });

  socket.on('message', (message) => {
    console.log(message);
    socket.broadcast.emit('message', message); // emit to all except sender
  });

  socket.on('disconnect', (socket) => {
    if (users[nickname]) {
      console.log(users[nickname]['id']);
      io.emit('leftRoom', {userLeft: nickname, msg: `${nickname} has left the chat.`});
      if (currentlyTyping[nickname]) {
        delete currentlyTyping[nickname];
        io.emit('isTyping', Object.keys(currentlyTyping));
      }
      delete users[nickname];
      io.emit('users', Object.keys(users));
    }
    console.log('A user has disconnected');
  });

  socket.on('isTyping', (user) => {
    console.log(user + ' is typing or not');
    if (currentlyTyping[user]) { // if already typing delete
      delete currentlyTyping[user];
    } else { // add
       currentlyTyping[user] = true;
    }
    io.emit('isTyping', Object.keys(currentlyTyping));
  });

  socket.on('private', (message) => {
    let userId = users[message.to]['id'];
    console.log(userId);
    if (userId) {
    socket.to(userId).emit('private', {from: message.from, msg: message.msg});
    } else {
      // what if they are not there?
    }
  });
});

http.listen(PORT, () => {
  console.log(`Now listening on PORT: ${PORT}.`);
});
