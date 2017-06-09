

var io = require('socket.io-client');
var os = require('os-utils');
var config =  require ('./config');

var socket  = io(config.server, {
    query: {
        machine : config.machine,
        number : 558499990000,
        type: 'number'
    }
});



console.log(config);



socket.on('connect', function () {
    console.log('connect2');


    setInterval(function () {
        console.log('send_status');
        socket.emit('send_status', 'ok');
    }, 2000);

    setInterval(function () {
        console.log('send_status');
        socket.emit('send_status', 'error');
    }, 5000);

    socket.emit('send_status', 'waiting');
});

socket.on('disconnect', function () {
    console.log('disconnect')
});

// setInterval(function () {
//     // console.log(machine_id);
//     os.cpuUsage(function(v) {
//         socket.emit('cpu', Math.round(v * 100))
//     });

//     socket.emit('memory', Math.round((os.totalmem() - os.freemem()) * 100 / os.totalmem()));

//     // console.log('freemem', os.freemem());
//     // console.log('totalmem', os.totalmem());

//     // os.freeCommand(function (v) {
//     //     console.log('memory ' + v);
//     // });
// }, 1000);









setTimeout(() => {
    console.log('EMIT PING')
    socket.emit('myPing');
}, 1000);

