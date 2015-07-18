'use strict';
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var SerialPort = require('serialport').SerialPort;
var serialport = new SerialPort('COM3');
var numUsers = 0;
var distance = 0;
var arduino = false;

serialport.on('error', function (err) {
  arduino = false;
  console.log('Conexión con el puerto serial fallida: ' + err);
});

serialport.on('open', function () {
  arduino = true;
  serialport.on('data', function (data) {
    distance = new Buffer(data, 'binary').toString('utf8');
  });
});

app.use(express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/app/views/index.view.html');
});

app.get('/api', function (req, res) {
  res.json({ message: '¡Bienvenido a nuestra API!' });
});

app.get('/api/distance', function (req, res) {
  res.json({ cm: distance });
});

app.post('/api/arduino', function (req, res) {
  res.json({ state: arduino });
});

io.on('connection', function (socket) {
  ++numUsers;
  var interval = setInterval(function () {
    io.emit('distance', distance);
    console.log(distance);
    if (!arduino) {
      clearInterval(interval);
    }
  }, 1000);
  socket.on('disconnect', function () {
    --numUsers;
    if (!numUsers) {
      clearInterval(interval);
      serialport.close(function () {
        console.log('Conexión con el puerto serial cerrada');
      });
    }
  });
});


http.listen(3000, function () {
  console.log('Servidor web iniciado en el puerto 3000');
});
