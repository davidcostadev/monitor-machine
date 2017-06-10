

console.log('start');

const http = require('http');
const express = require('express');
const SocketIO = require('socket.io');

const Machine = require('./Machine.js');
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
const last_status = {};

io.set('origins', '*:*');

io.on('connection', socket => {
    
    var clientIp = socket.request.connection.remoteAddress;
    let machine = socket.handshake.query.machine;

    const currentUser = {};
    if (socket.handshake.query.type === 'machine') {
        machines[machine] = socket.id;
    } else if(socket.handshake.query.type === 'number') {
        currentUser.number = socket.handshake.query.number

        // console.log(currentUser);
        views.forEach(view => {
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

                socket.emit('get_status', {
                    number: number,
                    status: status
                });
            }
 
        // });
        // last_status[currentUser.number] = data;
    }

    console.log('[connection]', socket.id);

    currentUser.id = socket.id;
    currentUser.machine = machine;
    sockets[socket.id] = machine;



    socket.emit('registred', socket.id);

    socket.on('cpu', (data) => {
        machine = sockets[socket.id];

        views.forEach(view => {

            let json = {
                machine,
                cpu: data
            };
            // console.log(json);
            view.emit('get_cpu', json);
        }); 
    });

    socket.on('memory', (data) => {
        machine = sockets[socket.id];

        views.forEach(view => {
            let json = {
                machine,
                memory: data
            };
            // console.log(json);
            view.emit('get_memory', json);
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
        } else if (socket.handshake.query.type === 'number') {
            
            // console.log(currentUser);
            views.forEach(view => {
                view.emit('get_status', {
                    number: currentUser.number,
                    status: 'off'
                });
            });
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


    socket.on('send_status', (data) => {
        // console.log(currentUser);
        console.log(`send_status: ${currentUser.number} - "${data}"`);

        last_status[currentUser.number] = data;


        views.forEach(view => {
            view.emit('get_status', {
                number: currentUser.number,
                status: data
            });
        });      
    });

});


//
// // import DoSomething from './tasks/DoSomething';


// // const action = new DoSomething();

// // action.now();