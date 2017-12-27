const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const PORT = process.env.PORT || 3000;
const http = require('http').Server(app);
const io = require('socket.io').listen(http);

let currentColor;
let users = {}; // to store users

app.use(express.static(`${__dirname}/../`));

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../index.html`));
});

io.on('connection', (socket) =>{
  console.log(socket.id);
  let nickname;
  console.log('a user is connected');
  //io.emit('joinedRoom', `${socketId} has joined the chat.`)

  if (currentColor) {
    socket.emit('color', currentColor);
  }

  socket.on('nickname', (name) => {
    if(!users[name]) { // if not in the users obj
      users[name] = true; // add
      nickname = name;
      socket.emit('nickname', {name, code: 'OK'}); // emit OK for hide/show on clientdie
      io.emit('joinedRoom', `${nickname} has joined the chat.`) // emit to all users join
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
      io.emit('leftRoom', ` ${nickname} has left the chat.`);
      delete users[nickname];
      io.emit('users', Object.keys(users));
    }
  });
});

http.listen(PORT, () => {
  console.log(`Now listening on PORT: ${PORT}.`);
});
