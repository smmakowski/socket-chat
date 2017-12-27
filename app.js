$(document).ready(() => {
  let nickname;
  let currentlyTyping = false;
  let sendGroup = 'everyone';
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
    let $message;
    console.log('send group is', sendGroup);

    if (sendGroup === 'everyone') {
      $message = `<li>${nickname} : ${text}</li>`;
      socket.emit('message', {name: nickname, msg: text});
    } else {
      $message = `<li>${nickname} (PRIVATE TO ${sendGroup}) : ${text}`;
      socket.emit('private', {from: nickname, to: sendGroup, msg: text});
      console.log('SEND TO PRIVATE');
    }
    $('#messages').append($message);
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
    const $message = `<li>${message.name} : ${message.msg}</li>`;
    $('#messages').append($message);
  });

  socket.on('private', (message) => {
    const $message = `<li>(PRIVATE MESSAGE FROM) ${message.from}) : ${message.msg}</li>`
    console.log(message);
    $('#messages').append($message);

  })

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
        $('#messages').append('<li>YOU have joined the chat.</li>');
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
    $('#users-list').append(`<option value="everyone">Everyone</option>`);
    users.forEach((user) => {
      if(user === nickname) {
        $('#your-name').text(user);
      } else {
        $('#users-list').append(`<option value="${user}">${user}</option>`);
      }
    });
  });

  socket.on('isTyping', (typers) => {
    console.log(typers);
    const typersString = typers.map((typer) => {
      if (typer === nickname) {
        return 'YOU are typing...';
      }
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
    } else if (!value.length && currentlyTyping) {
      currentlyTyping = false;
      console.log('You have stopped typing');
      socket.emit('isTyping', nickname);
    }
    // do nothing if lenght is in between
  });

  $('#users-list').change((event) => {
      const $this = $('#users-list');
      const $selectedUser = $this.val();
      sendGroup = $selectedUser;
      console.log(sendGroup);
    });

  // });

});
