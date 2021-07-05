const io = require('socket.io-client');

const socket = io('ws://localhost:4000');
let payload = {
    costRange: [
        {
            min: 0,
            max: 100,
        },
        {
            min: 101,
            max: 200,
        },
        {
            min: 201,
            max: 300,
        },
        {
            min: 301,
            max: 500,
        },
        {
            min: 501,
            max: 1000,
        },
    ],
};

socket.emit('range', payload);

socket.on('range', (payload) => {
    console.log('client', payload);
});
