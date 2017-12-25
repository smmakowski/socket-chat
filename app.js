const socket = io();

console.log('We are in!');

$('#red').on('click', (event) => {
  // $('body').css({'background-color': 'red'});
  socket.emit('color', 'red');
});

$('#green').on('click', (event) => {
  //$('body').css({'background-color': 'green'});
  socket.emit('color', 'green');
});

$('#blue').on('click', (event) => {
  //$('body').css({'background-color': 'blue'});
  socket.emit('color', 'blue');
});

socket.on('color', (color) => {
  console.log(color);
  $('body').css({'background-color': color})
});
