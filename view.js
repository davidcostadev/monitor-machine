

const io = require('socket.io-client');

const socket  = io('http://localhost:3000', {
    query: {
        type: 'view'
    }
});



socket.on('connect', () => {
    console.log('connect');

});


socket.on('registred', (socket_id) => {
    console.log('ON registred');
    console.log(socket_id);
});

socket.on('get_cpu', data => {
    console.log(data);
})

socket.on('disconnect', () => {
    console.log('disconnect')
});




