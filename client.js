

const io = require('socket.io-client');
const os = require('os-utils');
const config =  require ('./config');

const socket  = io(config.server, {
    query: {
        machine : config.machine,
        type: 'machine'
    }
});



console.log(config);


let machine_id = 'none';


socket.on('connect', () => {
    console.log('connect');



});


socket.on('registred', (socket_id) => {
    console.log('ON registred');
    machine_id = socket_id;
    // console.log(machine_id);
});

socket.on('disconnect', () => {
    console.log('disconnect')
});

setInterval(() => {
    // console.log(machine_id);
    os.cpuUsage(function(v) {
        socket.emit('cpu', Math.round(v * 100))
    });
}, 1000);









setTimeout(() => {
    console.log('EMIT PING')
    socket.emit('myPing');
}, 1000);

