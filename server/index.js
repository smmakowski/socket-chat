const path = require('path');
const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;
const http = require('http').Server(app);
const io = require('socket.io').listen(http);

app.use(express.static(`${__dirname}/../`));

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../index.html`));
});

io.on('connection', (socket) =>{
  console.log('a user is connected');
});

// app.listen(PORT, () => {
//   console.log(`Listening on ${PORT}.`);
// })
http.listen(PORT, () => {
  console.log(`Now listening on PORT: ${PORT}.`);
});
