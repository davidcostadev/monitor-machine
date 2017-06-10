'use strict';

console.log('start');

var http = require('http');
var express = require('express');
var SocketIO = require('socket.io');

var Machine = require('./Machine.js');
// const View = require('./View.js');

var app = express();

var server = http.Server(app, '0.0.0.0');
var io = new SocketIO(server);

app.get('/', function (request, response) {
    response.send('OI');
});

var port = 3050;

server.listen(port, function () {
    console.log('[INFO] Listening on *:' + port);
});

console.log('before');

var machines = {};
var views = [];
var sockets = {};
var last_status = {};

io.set('origins', '*:*');

io.on('connection', function (socket) {

    var clientIp = socket.request.connection.remoteAddress;
    var machine = socket.handshake.query.machine;

    var currentUser = {};
    if (socket.handshake.query.type === 'machine') {
        machines[machine] = socket.id;
    } else if (socket.handshake.query.type === 'number') {
        currentUser.number = socket.handshake.query.number;

        // console.log(currentUser);
        views.forEach(function (view) {
            view.emit('get_status', {
                number: currentUser.number,
                status: 'esperando'
            });
        });
    } else {
        views.push(socket);

        // views.forEach(view => {

        for (var number in last_status) {
            var status = last_status[number];

            socket.emit('get_status', status);
        }

        // });
        // last_status[currentUser.number] = data;
    }

    console.log('[connection]', socket.id);

    currentUser.id = socket.id;
    currentUser.machine = machine;
    sockets[socket.id] = machine;

    socket.emit('registred', socket.id);

    socket.on('cpu', function (data) {
        machine = sockets[socket.id];

        views.forEach(function (view) {

            var json = {
                machine: machine,
                cpu: data
            };
            // console.log(json);
            view.emit('get_cpu', json);
        });
    });

    socket.on('memory', function (data) {
        machine = sockets[socket.id];

        views.forEach(function (view) {
            var json = {
                machine: machine,
                memory: data
            };
            // console.log(json);
            view.emit('get_memory', json);
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
        } else if (socket.handshake.query.type === 'number') {

            // console.log(currentUser);
            views.forEach(function (view) {
                view.emit('get_status', {
                    number: currentUser.number,
                    status: 'off'
                });
            });
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

    socket.on('send_status', function (data) {
        // console.log(currentUser);
        console.log('send_status: ' + currentUser.number + ' - "' + data + '"');

        last_status[currentUser.number] = {
            number: currentUser.number,
            status: data,
            time: new Date().getTime()
        };

        views.forEach(function (view) {
            view.emit('get_status', {
                number: currentUser.number,
                status: data,
                time: new Date().getTime()
            });
        });
    });
});

//
// // import DoSomething from './tasks/DoSomething';


// // const action = new DoSomething();

// // action.now();