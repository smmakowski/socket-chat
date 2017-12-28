$(document).ready(() => {
  isProperName('asdf');
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
      $message = `<div class="msg row">${nickname} : ${text}</div>`;
      socket.emit('message', {name: nickname, msg: text});
    } else {
      $message = `<div class='msg private row'>${nickname} (PRIVATE TO ${sendGroup}) : ${text}</div>`;
      socket.emit('private', {from: nickname, to: sendGroup, msg: text});
      console.log('SEND TO PRIVATE');
    }
    $('#messages').append($message);
    $('#msg').val('');
    currentlyTyping = false;
    console.log('submitted');
    socket.emit('isTyping', nickname);
  });

  socket.on('color', (color) => {
    console.log(color);
    $('body').css({'background-color': color})
  });

  socket.on('message', (message) => {
    const $message = `<div class="msg row">${message.name} : ${message.msg}</div>`;
    $('#messages').append($message);
  });

  socket.on('private', (message) => {
    const $message = `<div class="msg private row">(PRIVATE MESSAGE FROM) ${message.from}) : ${message.msg}</div>`
    console.log(message);
    $('#messages').append($message);

  })

  socket.on('joinedRoom', (message) =>{
    const $message = `<div class="room-event msg row">${message}</div>`;
    $('#messages').append($message);
  });

  socket.on('leftRoom', (message) => {
    console.log(message);
    const $message = `<div class="room-event msg row">${message.msg}</div>`;
    $('#messages').append($message);
    sendGroup = 'everyone';
  });

  socket.on('nickname', (message) => {
    switch (message.code) {
      case 'OK' :
        $('nickname-input').val('');
        $('#nickname-entry').hide();
        $('#chat').show();
        nickname = message.name;
        $('#messages').append('<div class="msg row">YOU have joined the chat.</div>');
        $('#subtitle').text(`You are currently in the chatroom as ${nickname}.`);
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
    let nickname = $('#nickname-input').val();
    if (isProperName(nickname)) {
      socket.emit('nickname', nickname);
    } else {
      alert('Invalid nickname! Please create a nickname containing only alpahanumeric characters, and underscores.');
    }

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
