

var io = require('socket.io-client');
var os = require('os-utils');
var config =  require ('./config');

var socket  = io(config.server, {
    query: {
        machine : config.machine,
        type: 'machine'
    }
});



console.log(config);


var machine_id = 'none';


socket.on('connect', function () {
    console.log('connect2');



});


socket.on('registred', function (socket_id) {
    console.log('ON registred');
    machine_id = socket_id;
    // console.log(machine_id);
});

socket.on('disconnect', function () {
    console.log('disconnect')
});

setInterval(function () {
    // console.log(machine_id);
    os.cpuUsage(function(v) {
        socket.emit('cpu', Math.round(v * 100))
    });

    socket.emit('memory', Math.round((os.totalmem() - os.freemem()) * 100 / os.totalmem()));

    // console.log('freemem', os.freemem());
    // console.log('totalmem', os.totalmem());

    // os.freeCommand(function (v) {
    //     console.log('memory ' + v);
    // });
}, 1000);









setTimeout(() => {
    console.log('EMIT PING')
    socket.emit('myPing');
}, 1000);

