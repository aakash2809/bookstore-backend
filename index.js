const express = require('express');
const axios = require('axios');
const cors = require('cors');
const logger = require('./config/logger');

const app = express();
const baseUrl = 'http://localhost:2000';
app.use(cors());
app.use(express.static(__dirname + '/public/'));

// listen for request
const server = app.listen(4000, () => {
    logger.info(`Connected, server started listening on port :`, 4000);
});

const io = require('socket.io')(server);

let getData = (payload) => {
    return axios.post(`${baseUrl}/books/filter/byRange`, payload);
};

io.on('connection', (socket) => {
    logger.info('connected with soket');
    socket.on('range', async (payload) => {
        let result = [];
        result = await getData(payload);
        socket.emit('range', result.data.data);
    });
});
