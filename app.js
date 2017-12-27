$(document).ready(() => {
  let nickname;
  $('#chat').hide(); // hide chat

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

  $('#msg-form').on('submit', (event) => {
    event.preventDefault();
    const text = $('#msg').val();
    const $message = `<li>${nickname}: ${text}</li>`;
    $('#messages').append($message);
    socket.emit('message', {name: nickname, msg: text});
    $('input').val('');
  });

  socket.on('color', (color) => {
    console.log(color);
    $('body').css({'background-color': color})
  });

  socket.on('message', (message) => {
    const $message = `<li>${message.name}: ${message.msg}</li>`;
    $('#messages').append($message);
  });

  socket.on('joinedRoom', (message) =>{
    const $message = `<li>${message}</li>`;
    $('#messages').append($message);
  });

  socket.on('leftRoom', (message) => {
    console.log(message);
    const $message = `<li>${message}</li>`;
    $('#messages').append($message);
  });

  socket.on('nickname', (message) => {
    switch (message.code) {
      case 'OK' :
        $('#nickname-div').hide();
        $('#chat').show();
        nickname = message.name;
        break;
      case 'NO' :
        alert(message.msg);
      default:
        // no nothing;
    }
  });

  socket.on('users', (users) =>{
    console.log(users);
    $('#users-list').empty();
    console.log(users);
    $('#users-count').text(users.length);
    users.forEach((user) => {
      $('#users-list').append(`<li>${user}</li>`);
    });
  });

  $('#nickname-form').on('submit', (event) => {
    event.preventDefault();
    socket.emit('nickname', $('#nickname-input').val());
    $('#nickname-input').val('');
  });
  // });
});
