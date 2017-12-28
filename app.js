$(document).ready(() => {
  isProperName('asdf');
  let nickname;
  let currentlyTyping = false;
  let sendGroup = 'everyone';

  const socket = io();

  $('#red').on('click', (event) => {
    socket.emit('color', '#c9302c');
  });

  $('#green').on('click', (event) => {
    socket.emit('color', '#449d44');
  });

  $('#blue').on('click', (event) => {
    socket.emit('color', '#31b0d5');
  });

  $('#yellow').on('click', (event) => {
    socket.emit('color', '#ec971f');
  });

  $('#msg-form').on('submit', (event) => {
    event.preventDefault();
    const text = $('#msg').val();
    let $message;

    if (sendGroup === 'everyone') {
      $message = `<div class="msg row publ"><b>YOU say</b> ${text}</div>`;
      socket.emit('message', {name: nickname, msg: text});
    } else {
      $message = `<div class='msg priv row'><b>YOU whisper to ${sendGroup}</b> ${text}</div>`;
      socket.emit('private', {from: nickname, to: sendGroup, msg: text});
      console.log('SEND TO PRIVATE');
    }

    $('#messages').append($message);
    $('#msg').val('');
    currentlyTyping = false;
    const messagesDiv = document.getElementById("messages");
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    socket.emit('isTyping', nickname);
  });

  socket.on('color', (color) => {
    $('body').css({'background-color': color});
  });

  socket.on('message', (message) => {
    const $message = `<div class="msg row publ"><div class="col"><b>${message.name} says</b> ${message.msg}</div></div>`;
    $('#messages').append($message);
  });

  socket.on('private', (message) => {
    const $message = `<div class="msg priv row"><b>${message.from} whispers to you</b> ${message.msg}</div>`
    $('#messages').append($message);
  })

  socket.on('joinedRoom', (user) =>{
    const $message = `<div class="room-event msg row"><b>${user}</b> has joined the room.</div>`;
    $('#messages').append($message);
  });

  socket.on('leftRoom', (user) => {
    // console.log(message);
    const $message = `<div class="room-event msg row"><b>${user}</b> has left the room.</div>`;
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
        $('#messages').append('<div class="msg row room-event"><b>YOU</b> have joined the chat.</div>');
        $('#subtitle').text(`You are currently in the chatroom as ${nickname}.`);
        break;
      case 'NO' :
        $('#nickname-entry').effect('shake');
        // alert(message.msg);
      default:
        // no nothing;
    }
  });

  socket.on('users', (users) =>{
    console.log(users);
    $('#online-list').empty();
    $('#users-list').empty();
    console.log(users);
    $('#users-count').text(users.length);
    $('#users-list').append(`<option value="everyone">Everyone</option>`);
    users.forEach((user) => {
      if(user === nickname) {
        $('#your-name').text(user);
        $('#online-list').append(`<li class="list-group-item">YOU</li>`);
      } else {
        $('#users-list').append(`<option value="${user}">${user}</option>`);
        $('#online-list').append(`<li class="list-group-item">${user}</li>`);
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
      $('#nickname-entry').effect('shake');
      // alert('Invalid nickname! Please create a nickname containing only alpahanumeric characters, and underscores.');
    }

    $('#nickname-input').val('');
  });

  $('#msg').on('input', (event) => {

    event.preventDefault();
    let value = $('#msg').val();
    //console.log(value);
    if (value.length >= 1 && !currentlyTyping) {
      currentlyTyping = true;
      socket.emit('isTyping', nickname);
      //console.log('You are currently typing now');
    } else if (!value.length && currentlyTyping) {
      currentlyTyping = false;
    //  console.log('You have stopped typing');
      socket.emit('isTyping', nickname);
    }
    // do nothing if lenght is in between
  });

  $('#users-list').change((event) => {
      const $this = $('#users-list');
      const $selectedUser = $this.val();
      sendGroup = $selectedUser;
      //console.log(sendGroup);
    });

  // });

});
