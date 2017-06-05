

console.log('start');

const http = require('http');
const express = require('express');
const SocketIO = require('socket.io');

// const Machine = require('./Machine.js');
// const View = require('./View.js');

const app = express();

const server = http.Server(app, '0.0.0.0');
const io = new SocketIO(server);


app.get('/', (request, response) => {
    response.send('OI');
});

const port = 3050;



server.listen(port, () => {
    console.log('[INFO] Listening on *:' + port);
});

console.log('before');


const machines = {};
const views    = [];
const sockets  = {};

io.set('origins', '*:*');

io.on('connection', socket => {
    console.log('[connection]')
    var clientIp = socket.request.connection.remoteAddress;
    let machine = socket.handshake.query.machine;

    if(socket.handshake.query.type === 'machine') {
        
        var currentUser = {
            id: socket.id,
            machine
        };

        console.log(currentUser);


        machines[machine] = socket.id;
        
    } else {
        let currentUser = {
            id: socket.id,
        };

        console.log(currentUser);

        views.push(socket);
    }

    sockets[socket.id] = machine;



    socket.emit('registred', socket.id);

    socket.on('cpu', (data) => {
        console.log( 'CPU Usage (%): '+ sockets[socket.id]+'-'  + data );

        machine = sockets[socket.id];

        views.forEach(socket => {

            let json = {
                machine,
                cpu: data
            };
            console.log(json);
            socket.emit('get_cpu', json);
        }); 
    });

    socket.on('memory', (data) => {
        console.log( 'Memory Usage (%): '+ sockets[socket.id]+'-'  + data );

        machine = sockets[socket.id];

        views.forEach(socket => {

            let json = {
                machine,
                memory: data
            };
            console.log(json);
            socket.emit('get_memory', json);
        }); 
    });

    socket.on('myPing', () => {
        console.log('ON myPing');
        socket.emit('myPong');
    });

    socket.on('disconnect', () => {
        console.log(socket.id);

        const old = socket.id;
        if (socket.handshake.query.type === 'machine') { 
            delete machines[socket.handshake.query.machine];
            delete sockets[socket.id];
        } else {
            let indexDelete = 0;
            views.forEach((socket, index) => {
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