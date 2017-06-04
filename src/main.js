

console.log('start');

const http = require('http');
const express = require('express');
const SocketIO = require('socket.io');

const Machine = require('./Machine.js');
const View = require('./View.js');

const app = express();

const server = http.Server(app, '0.0.0.0');
const io = new SocketIO(server);


app.get('/', (request, response) => {
    response.send('OI');
});

const port = 3000;



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

    if(socket.handshake.query.type === 'machine') {
        let machine = socket.handshake.query.machine;
        var currentUser = {
            id: socket.id,
            machine
        };

        console.log(currentUser);


        machines[machine] = socket.id;
        sockets[socket.id] = machine;
    } else {
        let currentUser = {
            id: socket.id,
        };

        console.log(currentUser);

        views.push(socket);
    }



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

    socket.on('myPing', () => {
        console.log('ON myPing');
        socket.emit('myPong');
    });


});


//
// // import DoSomething from './tasks/DoSomething';


// // const action = new DoSomething();

// // action.now();