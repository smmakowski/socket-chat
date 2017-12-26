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

$('form').on('submit', (event) => {
  event.preventDefault();
  socket.emit('message', $('input').val());
  $('input').val('');
});

socket.on('color', (color) => {
  console.log(color);
  $('body').css({'background-color': color})
});

socket.on('message', (message) => {
  const $message = `<li>${message}</li>`;
  $('#messages').append($message);
});
