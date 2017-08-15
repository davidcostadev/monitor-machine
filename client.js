

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

var status = false;

socket.on('connect', function () {
    console.log('connect2');

    status = true;

});


socket.on('registred', function (socket_id) {
    console.log('ON registred');
    machine_id = socket_id;
    // console.log(machine_id);
});

socket.on('disconnect', function () {
    console.log('disconnect')

    status = false;
});

setInterval(function () {
    if (status) {
         os.cpuUsage(function(v) {
            socket.emit('cpu', Math.round(v * 100))
        });

        socket.emit('memory', Math.round((os.totalmem() - os.freemem()) * 100 / os.totalmem()));
    }
   
}, 5000);









setTimeout(() => {
    console.log('EMIT PING')
    socket.emit('myPing');
}, 1000);

