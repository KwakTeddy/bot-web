var socket = io();

function sendMsg(msg) {
  socket.emit('send_msg', msg);
}

socket.on('send_msg', function(msg) {
  console.log('out:'+msg);
  outputMessage(msg);
});

function init() {
  var main = document.getElementById('main');
  main.innerText = '';
  document.chatForm.inputbox.value = '';
  main.scrollTop = main.scrollHeight - main.clientHeight;

  sendMsg(':reset user');
}

function inputMessage(msg) {
  if(msg == ':초기화') {
    init();
    return false;
  }

  var main = document.getElementById('chat_main');
  var bubble = document.createElement('div');
  bubble.setAttribute('class', 'bubble bubble--alt');
  bubble.innerText = msg;
  main.appendChild(bubble);

  document.chatForm.inputbox.value = '';
  main.scrollTop = main.scrollHeight - main.clientHeight;

  sendMsg(msg);
}

function outputMessage(msg) {
  var main = document.getElementById('chat_main');
  var bubble = document.createElement('div');
  bubble.setAttribute('class', 'bubble');
  bubble.innerText = msg;
  main.appendChild(bubble);

  main.scrollTop = main.scrollHeight - main.clientHeight;
}
