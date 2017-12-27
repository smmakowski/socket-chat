$(document).ready(() => {
  let nickname;
  let currentlyTyping = false;
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
    currentlyTyping = false;
    console.log('submitted');
    socket.emit('isTyping', nickname);
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
      if(user === nickname) {
        $('#users-list').append(`<li>${user} (YOU)</li>`);
      } else {
        $('#users-list').append(`<li>${user}</li>`);
      }
    });
  });

  socket.on('isTyping', (typers) => {
    console.log(typers);
    const typersString = typers.map((typer) =>{
      return `${typer} is typing...`;
    }).join(', ');
    $('#currently-typing').text(typersString);
  });

  $('#nickname-form').on('submit', (event) => {
    event.preventDefault();
    socket.emit('nickname', $('#nickname-input').val());
    $('#nickname-input').val('');
  });

  $('#msg').on('input', (event) => {

    event.preventDefault();
    let value = $('#msg').val();
    console.log(value);
    if (value.length >= 1 && !currentlyTyping) {
      currentlyTyping = true;
      socket.emit('isTyping', nickname);
      console.log('You are currently typing now');
    } else if (!value.length) {
      currentlyTyping = false;
      console.log('You have stopped typing');
      socket.emit('isTyping', nickname);
    }
    // do nothing if lenght is in between
  });
  // });
});
