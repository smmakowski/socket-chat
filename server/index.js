const path = require('path');
const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;
const http = require('http').Server(app);
const io = require('socket.io').listen(http);

let currentColor;

app.use(express.static(`${__dirname}/../`));

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../index.html`));
});

io.on('connection', (socket) =>{
  console.log('a user is connected');
  if (currentColor) {
    socket.emit('color', currentColor);
  }
  socket.on('color', (color) => {
    console.log(color);
    currentColor = color;
    io.emit('color', color);
  });

  socket.on('message', (message) => {
    console.log(message);
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('a user has disconnected');
  });
});

// app.listen(PORT, () => {
//   console.log(`Listening on ${PORT}.`);
// })
http.listen(PORT, () => {
  console.log(`Now listening on PORT: ${PORT}.`);
});
