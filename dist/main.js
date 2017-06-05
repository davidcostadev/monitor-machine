'use strict';

console.log('start');

var http = require('http');
var express = require('express');
var SocketIO = require('socket.io');

var Machine = require('./Machine.js');
var View = require('./View.js');

var app = express();

var server = http.Server(app, '0.0.0.0');
var io = new SocketIO(server);

app.get('/', function (request, response) {
    response.send('OI');
});

var port = 3000;

server.listen(port, function () {
    console.log('[INFO] Listening on *:' + port);
});

console.log('before');

var machines = {};
var views = [];
var sockets = {};

io.set('origins', '*:*');

io.on('connection', function (socket) {
    console.log('[connection]');
    var clientIp = socket.request.connection.remoteAddress;
    var machine = socket.handshake.query.machine;

    if (socket.handshake.query.type === 'machine') {

        var currentUser = {
            id: socket.id,
            machine: machine
        };

        console.log(currentUser);

        machines[machine] = socket.id;
    } else {
        var _currentUser = {
            id: socket.id
        };

        console.log(_currentUser);

        views.push(socket);
    }

    sockets[socket.id] = machine;

    socket.emit('registred', socket.id);

    socket.on('cpu', function (data) {
        console.log('CPU Usage (%): ' + sockets[socket.id] + '-' + data);

        machine = sockets[socket.id];

        views.forEach(function (socket) {

            var json = {
                machine: machine,
                cpu: data
            };
            console.log(json);
            socket.emit('get_cpu', json);
        });
    });

    socket.on('memory', function (data) {
        console.log('Memory Usage (%): ' + sockets[socket.id] + '-' + data);

        machine = sockets[socket.id];

        views.forEach(function (socket) {

            var json = {
                machine: machine,
                memory: data
            };
            console.log(json);
            socket.emit('get_memory', json);
        });
    });

    socket.on('myPing', function () {
        console.log('ON myPing');
        socket.emit('myPong');
    });

    socket.on('disconnect', function () {
        console.log(socket.id);

        var old = socket.id;
        if (socket.handshake.query.type === 'machine') {
            delete machines[socket.handshake.query.machine];
            delete sockets[socket.id];
        } else {
            var indexDelete = 0;
            views.forEach(function (socket, index) {
                if (old == socket.id) {
                    indexDelete = index;
                }
            });

            views.splice(indexDelete, 1);
        }

        // if (findIndex(users, currentUser.id) > -1) users.splice(findIndex(users, currentUser.id), 1);
        // console.log('[INFO] User ' + currentUser.nick + ' disconnected!');
        // socket.broadcast.emit('userDisconnect', {nick: currentUser.nick});
    });
});

//
// // import DoSomething from './tasks/DoSomething';


// // const action = new DoSomething();

// // action.now();