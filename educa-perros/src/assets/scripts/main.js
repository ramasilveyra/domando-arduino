'use strict';

var socket = io();

var audio = {
  'osito': document.getElementsByClassName('record--osito'),
  'viejita': document.getElementsByClassName('record--viejita')
};

function getCheckedVal(name) {
  var radios = document.getElementsByName(name);
  var checkedValue = '';
  for (var i = 0, length = radios.length; i < length; i++) {
    if (radios[i].checked) {
      checkedValue = radios[i].value;
      break;
    }
  }
  return checkedValue;
}

var stopAlarm = function () {
  audio[getCheckedVal('target')][0].pause();
  audio[getCheckedVal('target')][0].currentTime = 0;
  document.getElementsByClassName('button--submit')[0].classList.remove('button--is-show');
};

socket.on('distance', function (msg) {
  var node = document.createElement('li');
  var textnode = document.createTextNode(msg + 'cm');
  node.appendChild(textnode);
  document.getElementsByClassName('educador__container__messages')[0].appendChild(node);
  if (msg < 200) {
    document.getElementsByClassName('button--submit')[0].classList.add('button--is-show');
    audio[getCheckedVal('target')][0].play();
  } else {
    stopAlarm();
  }
});

document.getElementsByClassName('button--submit')[0].addEventListener('click', function () {
  stopAlarm();
});
